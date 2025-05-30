const BaseAPIService = require('../../../shared/services/base-api.service');
const { BookingAdapter } = require('../adapters/booking-adapter');
const APP_MESSAGES = require('../../../shared/messages/app-messages');
const { BookingDetailsEntity } = require('../schemas/booking.entity');
const { BadRequestError } = require('../../../libs/core/error/custom-error');

class BookingService {
    constructor() {
        this._adapter = new BookingAdapter();
        this._baseService = new BaseAPIService(BookingDetailsEntity);
    }

    async getById(id) {
        return await this._baseService.getOne({ _id: id });
    }

    async getAll(filter = {}) {
        const {
            page = 1,
            limit = 10,
            startDate,
            endDate,
            ...queryFilters
        } = filter;

        const skip = (page - 1) * limit;

        const mongoQuery = { ...queryFilters };

        if (startDate || endDate) {
            mongoQuery.startDate = {};
            if (startDate) {
                mongoQuery.startDate.$gte = new Date(startDate);
            }
            if (endDate) {
                mongoQuery.startDate.$lte = new Date(endDate);
            }
        }

        const data = await this._baseService.getAllWithPagination(mongoQuery, skip, parseInt(limit));
        return data;
    }

    async createBooking(model) {
        if (!model._id) {
            model._id = new mongoose.Types.ObjectId();
        }
        model.parkingId = await this.generateUniqueParkingId()
        const adapted = this._adapter.adapt(model);
        return await this._baseService.create(adapted);
    }

    async updateBooking(id, model) {
        const existing = await BookingDetailsEntity.findById(id);
        if (!existing) throw new BadRequestError(APP_MESSAGES.BOOKING_NOT_FOUND);

        const updated = this._adapter.adaptToExisting(model, existing);
        return await this._baseService.update(id, updated);
    }

    async deleteBooking(id) {
        const result = await BookingDetailsEntity.findById(id);
        if (!result) throw new BadRequestError(APP_MESSAGES.BOOKING_NOT_FOUND);

        return await this._baseService.delete(id);
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
}

module.exports = { BookingService };
