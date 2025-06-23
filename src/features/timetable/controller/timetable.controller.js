const { ResponseHandler } = require("../../../libs/core/api-responses/response.handler");
const { TimetableEntity } = require("../schemas/timetable.entity");

class TimetableController {
  constructor() {
    this._responseHandler = new ResponseHandler();
  }

  async create(req, res) {
    const { time } = req.body
    const exist = await TimetableEntity.findOne({ time })
    if (exist) {
      this._responseHandler.sendDynamicError(res, "Time already exist", 400)
      return
    }
    const timetable = await new TimetableEntity(req.body).save()
    this._responseHandler.sendCreated(res, timetable);
  }

  async update(req, res) {
    const { time } = req.body
    const { id } = req.params
  
    const exist = await TimetableEntity.findOne({ _id: { $ne: id },  time })
    if (exist) {
      this._responseHandler.sendDynamicError(res, "Time already exist", 400)
      return
    }
  
    const timetable = await TimetableEntity.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' })
    if (!timetable) {
      this._responseHandler.sendDynamicError(res, "Timetable Id not found", 404)
      return
    }

    this._responseHandler.sendUpdated(res, timetable);
  }

  async getAll(req, res) {
    const shuttleBookings = await TimetableEntity.find().populate('parking').exec();
    this._responseHandler.sendSuccess(res, shuttleBookings);
  }

  async delete(req, res) {
    const timetable = await TimetableEntity.findByIdAndDelete(req.params.id, req.body)
    if (!timetable) {
      this._responseHandler.sendDynamicError(res, "Timetable Id not found", 404)
      return
    }
    
    this._responseHandler.sendDeleted(res);
  }
}

module.exports = { TimetableController };
