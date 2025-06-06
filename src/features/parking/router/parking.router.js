const { Router } = require('express');
const { asyncHandler } = require('../../../libs/core/handlers/async.handler');
const { ParkingController } = require('../controller/parking.controller');
const { validateRequest } = require('../../../middleware/validateRequest');
const { parkingSchema } = require('../validations/parking.validation');

const controller = new ParkingController();
const router = Router();

router
  .post(
    '/',
    validateRequest({ bodySchema: parkingSchema }),
    asyncHandler(async (req, res) => controller.create(req, res))
  )
  .get(
    '/',
    asyncHandler(async (req, res) => controller.getAll(req, res))
  );

router
  .put(
    '/:id',
    asyncHandler(async (req, res) => controller.update(req, res))
  )
  .get(
    '/:id',
    asyncHandler(async (req, res) => controller.getById(req, res))
  )
  .delete(
    '/:id',
    asyncHandler(async (req, res) => controller.delete(req, res))
  );
  
module.exports = { parkingRoutes: router };
