const { BadRequestError } = require("../../../libs/core/error/custom-error");
const APP_MESSAGES = require("../../../shared/messages/app-messages");
const BaseAPIService = require("../../../shared/services/base-api.service");
const { ParkingAdapter } = require("../adapters/parking-adapter");
const { ParkingEntity } = require("../schemas/parking.entity");

class ParkingService {
  constructor() {
    this._adapter = new ParkingAdapter();
    this._baseService = new BaseAPIService(ParkingEntity);
  }

  async getById(id) {
        return await this._baseService.getOne({ _id: id });
  }

  async getAll() {
      const data = await this._baseService.getAll({},{});
      return data;
  }

  async findByName(name) {
    const filter = {
      name,
    };
    return await this._baseService.getOne(filter);
  }

  async createParking(model) {
    const result = this._adapter.adapt(model);
    const user = await this._baseService.create(result);
    return user;
  }

  async updateParking(id, model) {
      const existing = await ParkingEntity.findById(id);
      if (!existing) throw new BadRequestError(APP_MESSAGES.PARKING_NOT_FOUND);

      const updated = this._adapter.adaptToExisting(model, existing);
      return await this._baseService.update(id, updated);
  }

  async deleteParking(id) {
      const result = await ParkingEntity.findById(id);
      if (!result) throw new BadRequestError(APP_MESSAGES.PARKING_NOT_FOUND);

      //return await this._baseService.delete(id);
      return await result.deleteOne()
  }
}

module.exports = { ParkingService };
