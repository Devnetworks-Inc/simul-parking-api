const { Router } = require('express');
const { asyncHandler } = require('../../../libs/core/handlers/async.handler');
const { BookingController } = require('../controller/booking.controller');

const controller = new BookingController();
const router = Router();

router
  .post(
    '/',
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
  
module.exports = { bookingRoutes: router };
