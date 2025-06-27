const { Router } = require('express');
const { asyncHandler } = require('../../../libs/core/handlers/async.handler');
const { validateRequest } = require('../../../middleware/validateRequest');
const { routeSchema } = require('../validations/route.validation');
const { RouteController } = require('../controller/route.controller');

const controller = new RouteController();
const router = Router();

router
.post(
  '/',
    validateRequest({ bodySchema: routeSchema }),
    asyncHandler(async (req, res) => controller.create(req, res))  
)
.get(
    '/',
    asyncHandler(async (req, res) => controller.getAll(req, res))
  )

module.exports = { timetableCreateRoutes: router };