const { differenceInDays, differenceInHours } = require("date-fns")
const { ResponseHandler } = require("../../../libs/core/api-responses/response.handler");
const { NotFoundError } = require("../../../libs/core/error/custom-error");
const APP_MESSAGES = require("../../../shared/messages/app-messages");
const { BookingService } = require("../services/booking.service");
const { BookingAdapter } = require("../adapters/booking-adapter");
const { bookingSchema } = require("../validations/booking.validation");
const { config } = require('../../../configs/config');
const { default: mongoose } = require("mongoose");
const { ParkingEntity } = require("../../parking/schemas/parking.entity");
const { BookingDetailsEntity } = require("../schemas/booking.entity");
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
        const filter = req.query || {};
        const data = await this._service.getAll(filter);
        this._responseHandler.sendSuccess(res, data);
    }

    async getById(req, res) {
        const id = req.params.id;
        const result = await this._service.getById(id);
        if (!result) throw new NotFoundError(APP_MESSAGES.BOOKING_NOT_FOUND);
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

        const parking = await ParkingEntity.findById(parkingEstablishmentId)
        if (!parking) {
            this._responseHandler.sendDynamicError(res, "Parking Establishment does not exist", 404)
            return;
        }

        let days = differenceInHours(endDatetime, startDatetime) / 24
        if (days <= 0) {
            this._responseHandler.sendDynamicError(res, "End Date must be greater than Start Date", 400)
            return;
        }

        const totalAmount = Math.ceil(days) * parking.price

        bookingModel._id = new mongoose.Types.ObjectId();
        
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
        this._responseHandler.sendCreated(res, { sessionUrl: session.url });
    }

    async createStripeCheckoutSession( { currency, product, amount, quantity, metadata, success_route, cancel_route, customer_email }, req ){

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
        const updatedData = req.body;

        const { error } = bookingSchema.validate(updatedData);
        if (error) throw new Error(error.details[0].message);
        
        const result = await this._service.updateBooking(id, updatedData);
        if (!result) throw new NotFoundError(APP_MESSAGES.BOOKING_NOT_FOUND);
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
