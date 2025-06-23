const { Router } = require('express');
const { asyncHandler } = require('../../../libs/core/handlers/async.handler');
const { BookingController } = require('../controller/booking.controller');
const validateToken = require('../../../middleware/validateToken')

const controller = new BookingController();
const router = Router();

router
  .post(
    '/',
    asyncHandler(async (req, res) => controller.create(req, res))
  )
  .get(
    '/:id',
    asyncHandler(async (req, res) => controller.getById(req, res))
  );
  
router
  .use(validateToken)
  .put(
    '/location/:id',
    asyncHandler(async (req, res) => controller.updateParkingSpaceLocation(req, res))
  )
  .put(
    '/picked-up/:id',
    asyncHandler(async (req, res) => controller.updateVehiclePickedUp(req, res))
  )
  .put(
    '/:id',
    asyncHandler(async (req, res) => controller.update(req, res))
  )
  .get(
    '/',
    asyncHandler(async (req, res) => controller.getAll(req, res))
  )
  .delete(
    '/:id',
    asyncHandler(async (req, res) => controller.delete(req, res))
  );
  
module.exports = { bookingRoutes: router };
