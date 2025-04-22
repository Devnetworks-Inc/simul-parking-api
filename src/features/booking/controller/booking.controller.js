const { ResponseHandler } = require("../../../libs/core/api-responses/response.handler");
const { NotFoundError } = require("../../../libs/core/error/custom-error");
const APP_MESSAGES = require("../../../shared/messages/app-messages");
const { BookingService } = require("../services/booking.service");
const { BookingAdapter } = require("../adapters/booking-adapter");
const { bookingSchema } = require("../validations/booking.validation");

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

        const { error } = bookingSchema.validate(bookingModel);
        if (error) throw new Error(error.details[0].message);

        const created = await this._service.createBooking(bookingModel);
        this._responseHandler.sendCreated(res, created);
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
