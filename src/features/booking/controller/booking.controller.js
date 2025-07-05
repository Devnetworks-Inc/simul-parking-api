const { compareAsc, differenceInMinutes } = require("date-fns")
const { ResponseHandler } = require("../../../libs/core/api-responses/response.handler");
const { NotFoundError } = require("../../../libs/core/error/custom-error");
const APP_MESSAGES = require("../../../shared/messages/app-messages");
const { BookingService } = require("../services/booking.service");
const { BookingAdapter } = require("../adapters/booking-adapter");
const { bookingSchema } = require("../validations/booking.validation");
const { config } = require('../../../configs/config');
const { default: mongoose } = require("mongoose");
const { ParkingEntity, ParkingSpaceEntity } = require("../../parking/schemas/parking.entity");
const { BookingDetailsEntity } = require("../schemas/booking.entity");
const { ShuttleBookingEntity } = require("../../shuttleBooking/schemas/shuttleBooking.entity");
const stripe = require('stripe')(config.STRIPE_KEY)

class BookingController {
    constructor() {
        this._service = new BookingService();
        this._responseHandler = new ResponseHandler();
        this._adapter = new BookingAdapter()
    }

    async generateUniqueParkingId() {
        const prefix = 'PK';
        let isUnique = false;
        let parkingId = '';

        while (!isUnique) {
            const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
            const timestamp = Date.now().toString().slice(-5);
            parkingId = `${prefix}-${randomPart}-${timestamp}`;

            const existingBooking = await BookingDetailsEntity.findOne({ parkingId });
            if (!existingBooking) {
                isUnique = true;
            }
        }

        return parkingId;
    }

    async getAll(req, res) {
        const { page = 1, limit = 10, startDate, endDate } = req.query || {};
        const filter = { schemaVersion: { $gte: 2 } }
        let startDateFilter
        if (startDate) {
            startDateFilter = {}
            startDateFilter.$gte = startDate
        }
        if (endDate) {
            startDateFilter = startDateFilter || {}
            startDateFilter.$lte = endDate
        }
        if (startDateFilter) {
            filter.startDate = startDateFilter
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            BookingDetailsEntity.find(filter).skip(skip).limit(limit).populate('parkingSpaceLocation').lean(),
            BookingDetailsEntity.countDocuments(filter)
        ])
        const today = new Date()

        const dataWithShuttleBookings = await Promise.all(data.map(d => new Promise((resolve) => {
            (async () => {
                const comparisonDate = d.vehiclePickedUpDate ? new Date(d.vehiclePickedUpDate) : today;
                const isPastPeriod = compareAsc(comparisonDate, d.endDatetime) === 1;
                const shuttleBooking = await ShuttleBookingEntity.findOne({ parkingBookingId: d._id }).lean()

                let subtotal = d.totalAmount
                let daysPassed = 0
                let parkingPriceOverstay = 0

                if (isPastPeriod) {
                    daysPassed = Math.ceil(differenceInMinutes(comparisonDate, d.endDatetime) / 1440)
                    parkingPriceOverstay = daysPassed * d.parkingPrice
                    d.totalAmount = d.totalAmount + parkingPriceOverstay
                }

                resolve({
                    ...d,
                    isPastPeriod,
                    shuttleBooking,
                    daysPassed,
                    subtotal,
                    parkingPriceOverstay
                })
            })()
        })))

        const response = {
            data: dataWithShuttleBookings,
            total,
            page: Math.ceil(skip / limit) + 1,
            pageSize: limit
        };

        this._responseHandler.sendSuccess(res, response)
    }

    async getById(req, res) {
        const id = req.params.id;
        const result = await this._service.getById(id);
        if (!result) throw new NotFoundError(APP_MESSAGES.BOOKING_NOT_FOUND);

        const shuttleBooking = await ShuttleBookingEntity.find({ parkingBookingId: result._id }).lean()
        result.shuttleBooking = shuttleBooking
        const today = new Date()
        const comparisonDate = result.vehiclePickedUpDate ? new Date(result.vehiclePickedUpDate) : today;
        result.isPastPeriod = compareAsc(comparisonDate, result.endDatetime) === 1
        result.subtotal = result.totalAmount
        result.parkingPriceOverstay = 0
        if (result.isPastPeriod) {
            result.daysPassed = Math.ceil(differenceInMinutes(comparisonDate, result.endDatetime) / 1440)
            result.parkingPriceOverstay = result.daysPassed * result.parkingPrice
            result.totalAmount = result.totalAmount + result.parkingPriceOverstay
        }

        this._responseHandler.sendSuccess(res, result);
    }

    async create(req, res) {
        const { successRoute, cancelRoute } = req.body;

        const forValidationModel = { ...req.body };
        //exclude fields for validation
        delete forValidationModel.successRoute;
        delete forValidationModel.cancelRoute;
        const { error, value: validatedBookingSchema } = bookingSchema.validate(forValidationModel, { stripUnknown: true });
        if (error) throw new Error(error.details[0].message);

        const bookingModel = this._adapter.adapt(validatedBookingSchema)

        const { endDatetime, startDatetime, parkingEstablishmentId } = bookingModel

        if(!req.body.airportToParkingShuttle.airportGate){
            this._responseHandler.sendDynamicError(res, "Airport Gate is required", 400)
            return;
        }

        const parking = await ParkingEntity.findById(parkingEstablishmentId)
        if (!parking) {
            this._responseHandler.sendDynamicError(res, "Parking Establishment does not exist", 404)
            return;
        }

        let days = differenceInMinutes(endDatetime, startDatetime) / 1440
        if (days <= 0) {
            this._responseHandler.sendDynamicError(res, "End Date must be greater than Start Date", 400)
            return;
        }

        const totalAmount = Math.ceil(days) * parking.price

        bookingModel._id = new mongoose.Types.ObjectId();
        bookingModel.totalAmount = totalAmount
        bookingModel.parkingPrice = parking.price

        const checkout = {
            customer_email: bookingModel.email,
            currency: 'chf',
            product: `Simul Parking: ${bookingModel.firstName} ${bookingModel.lastName} booked parking space at ${bookingModel.parkingName}(${bookingModel.parkingEstablishmentId})`,
            amount: totalAmount,
            quantity: 1,
            success_route: encodeURI(successRoute),
            cancel_route: encodeURI(cancelRoute),
            metadata: {
                booking_id: bookingModel._id.toString(),
                product_service: 'SIMUL_PARKING_SPACE_BOOKING'
            }
        }

        const session = await this.createStripeCheckoutSession(checkout, req);
        bookingModel.checkoutSessionId = session.id
        bookingModel.bookingDate = new Date();
        bookingModel.parkingId = await this.generateUniqueParkingId()
        await bookingModel.save();
        await ShuttleBookingEntity.create({
            ...req.body.parkingToAirportShuttle,
            parkingId: req.body.parkingId,
            parkingBookingId: bookingModel._id
        })
        await ShuttleBookingEntity.create({
            ...req.body.airportToParkingShuttle,
            parkingId: req.body.parkingId,
            parkingBookingId: bookingModel._id
        })
        this._responseHandler.sendCreated(res, { sessionUrl: session.url });
    }

    async createStripeCheckoutSession({ currency, product, amount, quantity, metadata, success_route, cancel_route, customer_email }, req) {

        const originUrl = req.headers.origin
        const expiresAt = new Date(new Date().getTime() + 30 * 60000)
        const expiresAtEpoch = Math.floor(expiresAt.getTime() / 1000)

        const session = await stripe.checkout.sessions.create({
            customer_email,
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: {
                            name: product,
                        },
                        unit_amount: amount * 100, //convert amount to cents
                    },
                    quantity: quantity,
                },
            ],
            mode: 'payment',
            payment_intent_data: {
                metadata,
            },
            metadata,
            //The Epoch time in seconds at which the Checkout Session will expire
            expires_at: expiresAtEpoch,
            success_url: `${originUrl}/${success_route}?bookingId=${metadata.booking_id}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${originUrl}/${cancel_route || ''}`,
        })

        return session
    }

    async update(req, res) {
        const id = req.params.id;
        const body = req.body;

        const { error, value: validatedBookingSchema } = bookingSchema.validate(body, { stripUnknown: true });
        if (error) throw new Error(error.details[0].message);

        let bookingModel = await BookingDetailsEntity.findById(id)

        if (!bookingModel) {
            this._responseHandler.sendDynamicError(res, "Parking Booking does not exist", 404)
            return;
        }

        const { startDate, endDate } = validatedBookingSchema
        const bookingUpdate = this._adapter.modifyParkingPeriod(validatedBookingSchema, startDate, endDate)

        const { endDatetime, startDatetime, parkingEstablishmentId } = bookingUpdate

        const parking = await ParkingEntity.findById(parkingEstablishmentId)
        if (!parking) {
            this._responseHandler.sendDynamicError(res, "Parking Establishment does not exist", 404)
            return;
        }

        let days = differenceInMinutes(endDatetime, startDatetime) / 1440
        if (days <= 0) {
            this._responseHandler.sendDynamicError(res, "End Date must be greater than Start Date", 400)
            return;
        }

        const totalAmount = Math.ceil(days) * parking.price

        bookingUpdate.totalAmount = totalAmount
        bookingUpdate.parkingPrice = parking.price

        const updatedBookingModel = await BookingDetailsEntity.findByIdAndUpdate(id, bookingUpdate, { returnDocument: 'after' })
        this._responseHandler.sendUpdated(res, updatedBookingModel);
    }

    async updateVehiclePickedUp(req, res) {
        const id = req.params.id;
        const { isVehiclePickedUp } = req.body;
        const parkingBooking = await BookingDetailsEntity.findByIdAndUpdate(id, {
            isVehiclePickedUp,
            vehiclePickedUpDate: isVehiclePickedUp ? Date.now() : null
        }, { returnDocument: 'after' }).populate('parkingSpaceLocation')

        if (!parkingBooking) {
            this._responseHandler.sendDynamicError(res, "Parking Booking does not exist", 404)
            return;
        }

        const parkingSpace = await ParkingSpaceEntity.findById(parkingBooking?.parkingSpaceLocation?._id);
        if (parkingSpace) {
            parkingSpace.isOccupied = false;
            await parkingSpace.save()
        }
        // parkingBooking.isVehiclePickedUp = isVehiclePickedUp
        // parkingBooking.vehiclePickedUpDate = isVehiclePickedUp ? Date.now() : null
        // const result = await parkingBooking.save()
        this._responseHandler.sendUpdated(res, parkingBooking);
    }

    async updateParkingSpaceLocation(req, res) {
        const id = req.params.id;
        const { parkingSpaceLocation } = req.body;
        const parkingBooking = await BookingDetailsEntity.findById(id)

        if (!parkingBooking) {
            this._responseHandler.sendDynamicError(res, "Parking Booking does not exist", 404)
            return;
        }

        const parkingSpace = await ParkingSpaceEntity.findById(parkingSpaceLocation);
        if (!parkingSpace) {
            this._responseHandler.sendDynamicError(res, "Parking Space does not exist", 404)
        }
        parkingSpace.isOccupied = true;
        await parkingSpace.save();

        parkingBooking.parkingSpaceLocation = parkingSpaceLocation
        const result = await parkingBooking.save()
        this._responseHandler.sendUpdated(res, result);
    }

    async delete(req, res) {
        const id = req.params.id;
        const result = await this._service.deleteBooking(id);
        if (!result) throw new NotFoundError(APP_MESSAGES.BOOKING_NOT_FOUND);
        this._responseHandler.sendDeleted(res);
    }
}

module.exports = { BookingController };
