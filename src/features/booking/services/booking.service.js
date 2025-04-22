const BaseAPIService = require('../../../shared/services/base-api.service');
const { BookingAdapter } = require('../adapters/booking-adapter');
const { NotAuthorizedError } = require('../../../libs/core/error/custom-error');
const APP_MESSAGES = require('../../../shared/messages/app-messages');
const { BookingDetailsEntity } = require('../schemas/booking.entity');

class BookingService {
    constructor() {
        this._adapter = new BookingAdapter();
        this._baseService = new BaseAPIService(BookingDetailsEntity);
    }

    async getById(id) {
        return await this._baseService.getOne({ _id: id });
    }

    async getAll(filter = {}) {
        return await this._baseService.getAll(filter);
    }

    async createBooking(model) {
        model.parkingId = await this.generateUniqueParkingId()
        const adapted = this._adapter.adapt(model);
        return await this._baseService.create(adapted);
    }

    async updateBooking(id, model) {
        const existing = await BookingDetailsEntity.findById(id);
        if (!existing) throw new NotAuthorizedError(APP_MESSAGES.BOOKING_NOT_FOUND);

        const updated = this._adapter.adaptToExisting(model, existing);
        return await this._baseService.update(id, updated);
    }

    async deleteBooking(id) {
        const result = await BookingDetailsEntity.findById(id);
        if (!result) throw new NotAuthorizedError(APP_MESSAGES.BOOKING_NOT_FOUND);

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
