const { ResponseHandler } = require("../../../libs/core/api-responses/response.handler");
const { NotFoundError } = require("../../../libs/core/error/custom-error");
const APP_MESSAGES = require("../../../shared/messages/app-messages");
const { BookingService } = require("../services/booking.service");
const { BookingAdapter } = require("../adapters/booking-adapter");
const { bookingSchema } = require("../validations/booking.validation");
const { config } = require('../../../configs/config');
const stripe = require('stripe')(config.STRIPE_KEY)

class BookingController {
    constructor() {
        this._service = new BookingService();
        this._responseHandler = new ResponseHandler();
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
        const bookingModel = req.body;

        const forValidationModel = { ...bookingModel };
        //exclude fields for validation
        delete forValidationModel.parkingEstablishmentId;
        delete forValidationModel.parkingName;
        delete forValidationModel.successRoute;
        delete forValidationModel.cancelRoute;
        const { error } = bookingSchema.validate(forValidationModel);
        if (error) throw new Error(error.details[0].message);

        const booking = await this._service.createBooking(bookingModel);
        const checkout = {
            customer_email: bookingModel.email,
            currency: 'chf',
            product: `Simul Parking: ${bookingModel.firstName} ${bookingModel.lastName} booked parking space at ${bookingModel.parkingName}(${bookingModel.parkingEstablishmentId})`,
            amount: bookingModel.totalAmount,
            quantity: 1,
            success_route: encodeURI(bookingModel.successRoute),
            cancel_route: encodeURI(bookingModel.cancelRoute),
            metadata: {
                booking_id: booking._id.toString(),
                product_service: 'SIMUL_PARKING_SPACE_BOOKING'
            }
        }
        const session = await this.createStripeCheckoutSession(checkout, req);
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
