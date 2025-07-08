const { ResponseHandler } = require("../../../libs/core/api-responses/response.handler");
const { NotFoundError } = require("../../../libs/core/error/custom-error");
const APP_MESSAGES = require("../../../shared/messages/app-messages");
const { ParkingService } = require("../services/parking.service");
const { ParkingAdapter } = require("../adapters/parking-adapter");
const { ParkingEntity } = require("../schemas/parking.entity");
const { RouteEntity } = require("../../timetable/schemas/route.entity");
const { ShuttleBookingEntity } = require("../../shuttleBooking/schemas/shuttleBooking.entity");

class ParkingController {
    constructor() {
        this._service = new ParkingService();
        this._responseHandler = new ResponseHandler();
        this._adapter = new ParkingAdapter();
    }

    async getAll(req, res) {
        const filter = req.query || {};
        const data = await this._service.getAll(filter);

        const updatedData = await Promise.all(
            data.map((d) => new Promise((resolve) => {
                ShuttleBookingEntity.find({ parkingId: d._id })
                    .then(shuttleBookings =>
                        resolve({ ...d, shuttleBookings })
                    )
            }))
        )

        this._responseHandler.sendSuccess(res, updatedData);
    }

    async getById(req, res) {
        const id = req.params.id;
        const result = await this._service.getById(id);
        if (!result) throw new NotFoundError(APP_MESSAGES.BOOKING_NOT_FOUND);
        this._responseHandler.sendSuccess(res, result);
    }

    async getParkingSpace(req, res) {
        const id = req.params.id;
        const result = await this._service.getAllParkingSpace(id);
        this._responseHandler.sendSuccess(res, result);
    }

    async create(req, res) {
        const parkingModel = req.body;
        const created = await ParkingEntity.create(parkingModel)
        this._responseHandler.sendCreated(res, created);
    }

    async createParkingSpace(req, res) {
        const parkingSpaceModel = req.body;
        const created = await this._service.createParkingSpace(parkingSpaceModel)
        this._responseHandler.sendCreated(res, created);
    }

    async update(req, res) {
        const id = req.params.id;
        const updatedData = req.body
        const result = await ParkingEntity.findByIdAndUpdate(id, updatedData, { returnDocument: 'after' });

        if (!result) {
            this._responseHandler.sendDynamicError(res, "Parking does not exists", 404)
            return
        }

        this._responseHandler.sendUpdated(res, result);
    }

    async delete(req, res) {
        const id = req.params.id;
        const result = await this._service.deleteParking(id);
        if (!result) throw new NotFoundError(APP_MESSAGES.BOOKING_NOT_FOUND);

         // Delete associated routes
        await RouteEntity.deleteMany({ parking: id });

        this._responseHandler.sendDeleted(res);
    }
}

module.exports = { ParkingController };
