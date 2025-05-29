const { ResponseHandler } = require("../../../libs/core/api-responses/response.handler");
const { NotFoundError } = require("../../../libs/core/error/custom-error");
const APP_MESSAGES = require("../../../shared/messages/app-messages");
const { ParkingService } = require("../services/parking.service");
const { ParkingAdapter } = require("../adapters/parking-adapter");
const { parkingSchema } = require("../validations/parking.validation");

class ParkingController {
    constructor() {
        this._service = new ParkingService();
        this._responseHandler = new ResponseHandler();
        this._adapter = new ParkingAdapter();
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
        const parkingModel = req.body;

        const { error } = parkingSchema.validate(parkingModel);
        if (error) throw new Error(error.details[0].message);

        const created = await this._service.createParking(parkingModel);
        this._responseHandler.sendCreated(res, created);
    }

    async update(req, res) {
        const id = req.params.id;
        const updatedData = this._adapter.adaptAsObject(req.body);

        const { error } = parkingSchema.validate(updatedData);
        if (error) throw new Error(error.details[0].message);
        
        const result = await this._service.updateParking(id, updatedData);
        if (!result) throw new NotFoundError(APP_MESSAGES.BOOKING_NOT_FOUND);
        this._responseHandler.sendUpdated(res, result);
    }

    async delete(req, res) {
        const id = req.params.id;
        const result = await this._service.deleteParking(id);
        if (!result) throw new NotFoundError(APP_MESSAGES.BOOKING_NOT_FOUND);
        this._responseHandler.sendDeleted(res);
    }
}

module.exports = { ParkingController };
