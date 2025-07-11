const { format, startOfDay, endOfDay, compareAsc, addHours, differenceInMinutes } = require("date-fns");
const { ResponseHandler } = require("../../../libs/core/api-responses/response.handler");
const { BookingDetailsEntity } = require("../../booking/schemas/booking.entity");
const { ParkingEntity, ParkingSpaceEntity } = require("../../parking/schemas/parking.entity");
const { ShuttleBookingEntity } = require("../schemas/shuttleBooking.entity");

class ShuttleBookingController {
  constructor() {
    this._responseHandler = new ResponseHandler();
  }

  async create(req, res) {
    const { parkingBookingId, parkingId, pickupDatetime } = req.body

    const [parkingBooking, parking] = await Promise.all([
      BookingDetailsEntity.findById(parkingBookingId),
      ParkingEntity.findById(parkingId)
    ])

    if (!parkingBooking) {
      this._responseHandler.sendDynamicError(res, "Parking Booking does not exist", 404)
      return;
    }
    if (!parking) {
      this._responseHandler.sendDynamicError(res, "Parking does not exist", 404)
      return;
    }

    let [dateStr, timeStr] = pickupDatetime.split(' ')
    dateStr = dateStr.split('-')
    timeStr = timeStr.split(':')

    const date = new Date(+dateStr[0], +dateStr[1] - 1, +dateStr[2])
    date.setHours(+timeStr[0], +timeStr[1])
    req.body.pickupDatetime = date
    req.body.parkingName = parking.name

    const shuttleBooking = new ShuttleBookingEntity(req.body);
    const created = await shuttleBooking.save();

    this._responseHandler.sendCreated(res, created);
  }

  async update(req, res) {
    const update = req.body
    const { pickupDatetime } = req.body

    const parkingBooking = await BookingDetailsEntity.findById(update.parkingBookingId)

    if (!parkingBooking) {
      this._responseHandler.sendDynamicError(res, "Parking Booking does not exist", 404)
      return;
    }

    let [dateStr, timeStr] = pickupDatetime.split(' ')
    dateStr = dateStr.split('-')
    timeStr = timeStr.split(':')

    const date = new Date(+dateStr[0], +dateStr[1] - 1, +dateStr[2])
    date.setHours(+timeStr[0], +timeStr[1])
    update.pickupDatetime = date
    update.parkingName = parkingBooking.name

    const shuttleBooking = await ShuttleBookingEntity.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after' });
    if (!shuttleBooking) {
      this._responseHandler.sendDynamicError(res, "Shuttle Booking does not exist", 404)
      return;
    }

    this._responseHandler.sendUpdated(res, shuttleBooking);
  }

  async setParkingSpaceLocation(req, res) {
    const { shuttleBookingId, parkingSpaceId } = req.body;

    const shuttleBooking = await ShuttleBookingEntity.findById(shuttleBookingId)
    if (!shuttleBooking) {
      this._responseHandler.sendDynamicError(res, "Shuttle Booking does not exist", 404)
      return;
    }

    const parkingSpace = await ParkingSpaceEntity.findByIdAndUpdate(parkingSpaceId, {
      isOccupied: true
    });
    if (!parkingSpace) {
      this._responseHandler.sendDynamicError(res, "Parking Space does not exist", 404)
      return
    }

    const promises = []

    // if previous shuttle booking space number is changed
    if (shuttleBooking.spaceNumber && shuttleBooking.spaceNumber !== parkingSpace.spaceNumber) {
      promises.push(ParkingSpaceEntity.findOneAndUpdate({ spaceNumber: shuttleBooking.spaceNumber }, { isOccupied: false }))
    }

    promises.push(ShuttleBookingEntity.updateMany({ parkingBookingId: shuttleBooking.parkingBookingId }, { spaceNumber: parkingSpace.spaceNumber }))
    promises.push(BookingDetailsEntity.findByIdAndUpdate(shuttleBooking.parkingBookingId, { parkingSpaceLocation: parkingSpace._id }))

    await Promise.all(promises)

    this._responseHandler.sendUpdated(res, { ...shuttleBooking.toJSON(), spaceNumber: parkingSpace.spaceNumber });
  }

  async setVehiclePickedUp(req, res) {
    const { shuttleBookingId, isVehiclePickedUp } = req.body;
  
    const shuttleBooking = await ShuttleBookingEntity.findById(shuttleBookingId)
    if (!shuttleBooking) {
      this._responseHandler.sendDynamicError(res, "Shuttle Booking does not exist", 404)
      return;
    }

    const today = new Date()

    const parkingBooking = await BookingDetailsEntity.findByIdAndUpdate(shuttleBooking.parkingBookingId, {
      isVehiclePickedUp,
      vehiclePickedUpDate: isVehiclePickedUp ? today : null
    }, { returnDocument: 'after' })

    if (parkingBooking?.parkingSpaceLocation) {
      await ParkingSpaceEntity.findByIdAndUpdate(parkingBooking.parkingSpaceLocation, {isOccupied: false})
    }

    const updatedShuttleBooking = await ShuttleBookingEntity.findByIdAndUpdate(shuttleBookingId, { vehiclePickedUpDate: today }, { returnDocument: 'after' })
    console.log({updatedShuttleBooking})

    this._responseHandler.sendUpdated(res, updatedShuttleBooking);
  }

  async getById(req, res) {
    const { id } = req.params

    const shuttleBooking = await ShuttleBookingEntity.findById(id).lean();
    if (!shuttleBooking) {
      this._responseHandler.sendDynamicError(res, "Shuttle Booking does not exist", 404)
      return;
    }

    const parkingBooking = await BookingDetailsEntity.findById(shuttleBooking.parkingBookingId)
    if (!parkingBooking) {
      this._responseHandler.sendDynamicError(res, "Parking Booking does not exist", 404)
      return;
    }
    const today = new Date()
    const comparisonDate = parkingBooking.vehiclePickedUpDate ? new Date(parkingBooking.vehiclePickedUpDate) : today;
    parkingBooking.isPastPeriod = compareAsc(comparisonDate, parkingBooking.endDatetime) === 1
    parkingBooking.subtotal = parkingBooking.totalAmount
    parkingBooking.parkingPriceOverstay = 0
    if (parkingBooking.isPastPeriod) {
        parkingBooking.daysPassed = Math.ceil(differenceInMinutes(comparisonDate, parkingBooking.endDatetime) / 1440)
        parkingBooking.parkingPriceOverstay = parkingBooking.daysPassed * parkingBooking.parkingPrice
        parkingBooking.totalAmount = parkingBooking.totalAmount + parkingBooking.parkingPriceOverstay
    }
    shuttleBooking.parkingBooking = parkingBooking

    this._responseHandler.sendSuccess(res, shuttleBooking);
  }

  async getAll(req, res) {
    const shuttleBookings = await ShuttleBookingEntity.find().exec();
    this._responseHandler.sendSuccess(res, shuttleBookings);
  }

  async mobileGetAll(req, res) {
    console.log('req.body', req.body)
    console.log('req.query', req.query)
    const today = new Date()
    const {
      startDate = addHours(today, -1),
      endDate = addHours(today, 1),
      route
    } = req.query || {}

    const filter = {}
  
    if (startDate) {
      filter.pickupDatetime = {}
      filter.pickupDatetime.$gte = startDate
    }

    if (endDate) {
      filter.pickupDatetime = filter.pickupDatetime || {}
      filter.pickupDatetime.$lte = endDate
    }
    console.log({ filter })
    // const shuttleBookings = await ShuttleBookingEntity.aggregate([
    //   { $match: filter },
    //   {
    //     $lookup: {
    //       from: "parking",
    //       localField: "parkingId",    // field in the orders collection
    //       foreignField: "_id",  // field in the items collection
    //       as: "parking"
    //     },
    //   },
    //   { $unwind: '$parking' }
    // ])

    const $or = [filter]
    if (route === 'airport-parking') {
      $or.push({
        vehiclePickedUpDate: null,
        pickupDatetime: { $lte: today },
      })
    }

    const shuttleBookings = await ShuttleBookingEntity.find({ route, $or }).sort({ pickupDatetime: 1 }).exec();
    console.log(shuttleBookings)

    this._responseHandler.sendSuccess(res, shuttleBookings);
  }

  async getTimetable(req, res) {
    const { date, route } = req.query
    const [year, month, day] = date.split('-')

    // create date object based on server timezone which is set to Europe/Berlin
    const dateObj = new Date(+year, +month - 1, +day)

    const start = startOfDay(dateObj)
    const end = endOfDay(dateObj)

    const shuttleBookings = await ShuttleBookingEntity.find({
      pickupDatetime: { $gte: start, $lte: end, $exists: true },
      route
    }).sort({ pickupDatetime: 'asc' }).lean();

    let currentTime
    let currentTimeData = []

    const timetable = shuttleBookings.reduce((arr, booking) => {
      const pickupTime = format(booking.pickupDatetime, 'HH:mm')

      if (currentTime !== pickupTime) {
        currentTime = pickupTime
        currentTimeData = [booking]
        arr.push({
          pickupTime,
          data: currentTimeData
        })
        return arr
      }

      const data = arr[arr.length - 1].data
      data.push(booking)
      return arr
    }, [])

    this._responseHandler.sendSuccess(res, timetable);
  }

  async delete(req, res) {

    const shuttleBooking = await ShuttleBookingEntity.findOneAndDelete({ _id: req.params.id });
    if (!shuttleBooking) {
      this._responseHandler.sendDynamicError(res, "Shuttle Booking does not exist", 404)
      return;
    }

    this._responseHandler.sendSuccess(res, shuttleBooking);
  }
}

module.exports = { ShuttleBookingController };
