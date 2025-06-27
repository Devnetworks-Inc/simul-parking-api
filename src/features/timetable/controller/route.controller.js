const { ResponseHandler } = require("../../../libs/core/api-responses/response.handler");
const { RouteEntity } = require("../schemas/route.entity");
const { TimetableEntity } = require("../schemas/timetable.entity");

class RouteController{
    constructor(){
        this._responseHandler = new ResponseHandler();
    }

    async create(req, res) {
        const data= req.body
        const { parking, type, airport } = req.body;
        const exist = await TimetableEntity.findOne({ parking, type, airport });
        if (exist) {
          this._responseHandler.sendDynamicError(
            res,
            "parking, type, or airport already exist",
            400
          );
          return;
        }
        const timetable = await new RouteEntity(data).save()
        this._responseHandler.sendCreated(res, timetable);
      }

      async getAll(req, res) {
        const shuttleBookings = await RouteEntity.find().populate('parking').exec();
        this._responseHandler.sendSuccess(res, shuttleBookings);
      }
    
}

module.exports = { RouteController };