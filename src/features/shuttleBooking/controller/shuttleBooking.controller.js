const { ResponseHandler } = require("../../../libs/core/api-responses/response.handler");
const { BookingDetailsEntity } = require("../../booking/schemas/booking.entity");
const { ParkingEntity } = require("../../parking/schemas/parking.entity");
const { ShuttleBookingEntity } = require("../schemas/shuttleBooking.entity");

class ShuttleBookingController {
  constructor() {
    this._responseHandler = new ResponseHandler();
  }

  async create(req, res) {
    const shuttleBooking = new ShuttleBookingEntity(req.body);
    const parkingBooking = await BookingDetailsEntity.findById(shuttleBooking.parkingBookingId)
    if (!parkingBooking) {
      this._responseHandler.sendDynamicError(res, "Parking Booking does not exist", 404)
      return;
    }
    const created = await shuttleBooking.save();
    this._responseHandler.sendCreated(res, created);
  }

  async update(req, res) {
    const update = req.body
    const parkingBooking = await BookingDetailsEntity.findById(update.parkingBookingId)

    if (!parkingBooking) {
      this._responseHandler.sendDynamicError(res, "Parking Booking does not exist", 404)
      return;
    }

    const shuttleBooking = await ShuttleBookingEntity.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after' });
    if (!shuttleBooking) {
      this._responseHandler.sendDynamicError(res, "Shuttle Booking does not exist", 404)
      return;
    }

    this._responseHandler.sendUpdated(res, shuttleBooking);
  }
}

module.exports = { ShuttleBookingController };
