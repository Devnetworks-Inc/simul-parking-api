const { Router } = require('express');
const { asyncHandler } = require('../../../libs/core/handlers/async.handler');
const { ParkingController } = require('../controller/parking.controller');
const { validateRequest } = require('../../../middleware/validateRequest');
const { parkingSchema, parkingSpaceSchema, spaceIdParamSchema } = require('../validations/parking.validation');
const { idParamSchema } = require('../../../shared/schema');
const validateToken = require('../../../middleware/validateToken');

const controller = new ParkingController();
const router = Router();

router
  .get(
    '/space/:id',
    validateRequest({ paramsSchema: idParamSchema }),
    asyncHandler(async (req, res) => controller.getParkingSpace(req, res))
  )
  .get(
    '/',
    asyncHandler(async (req, res) => controller.getAll(req, res))
  );

router
  .use(validateToken)
  .post(
    '/space',
    validateRequest({ bodySchema: parkingSpaceSchema }),
    asyncHandler(async (req, res) => controller.createParkingSpace(req, res))
  )
  .post(
    '/',
    validateRequest({ bodySchema: parkingSchema }),
    asyncHandler(async (req, res) => controller.create(req, res))
  )
  .put(
    '/space/:spaceId',
    validateRequest({ paramsSchema: spaceIdParamSchema, bodySchema: parkingSpaceSchema }),
    asyncHandler(async (req, res) => controller.updateParkingSpace(req, res))
  )
  .put(
    '/:id',
    validateRequest({ bodySchema: parkingSchema, paramsSchema: idParamSchema }),
    asyncHandler(async (req, res) => controller.update(req, res))
  )
  .get(
    '/:id',
    asyncHandler(async (req, res) => controller.getById(req, res))
  )
  .delete(
    '/space/:spaceId',
    validateRequest({ paramsSchema: spaceIdParamSchema }),
    asyncHandler(async (req, res) => controller.delete(req, res))
  )
  .delete(
    '/:id',
    asyncHandler(async (req, res) => controller.delete(req, res))
  );

module.exports = { parkingRoutes: router };
