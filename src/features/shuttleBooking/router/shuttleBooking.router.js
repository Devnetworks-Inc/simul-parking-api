const { Router } = require('express');
const { asyncHandler } = require('../../../libs/core/handlers/async.handler');
const { ShuttleBookingController } = require('../controller/shuttleBooking.controller');
const { validateRequest } = require('../../../middleware/validateRequest');
const { shuttleBookingSchema, idParamSchema } = require('../validations/shuttleBooking.validation');

const controller = new ShuttleBookingController();
const router = Router();

router
  .post(
    '/',
    validateRequest({ bodySchema: shuttleBookingSchema }),
    asyncHandler(async (req, res) => controller.create(req, res))
  )
   .get(
    '/:id',
    validateRequest({ paramsSchema: idParamSchema }),
    asyncHandler(async (req, res) => controller.getById(req, res))
  )
  .get(
    '/',
    asyncHandler(async (req, res) => controller.getAll(req, res))
  )

  .put(
    '/:id',
    validateRequest({ paramsSchema: idParamSchema, bodySchema: shuttleBookingSchema }),
    asyncHandler(async (req, res) => controller.update(req, res))
  )

  .delete(
    '/:id',
    validateRequest({ paramsSchema: idParamSchema }),
    asyncHandler(async (req, res) => controller.delete(req, res))
  );
  
module.exports = { shuttleBookingRoutes: router };
