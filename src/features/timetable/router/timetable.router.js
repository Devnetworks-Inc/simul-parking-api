const { Router } = require('express');
const { asyncHandler } = require('../../../libs/core/handlers/async.handler');
const { validateRequest } = require('../../../middleware/validateRequest');
const { timetableSchema } = require('../validations/timetable.validation');
const { TimetableController } = require('../controller/timetable.controller');
const { idParamSchema } = require('../../../shared/schema');
const validateToken = require('../../../middleware/validateToken');

const controller = new TimetableController();
const router = Router();

router
  .get(
    '/',
    asyncHandler(async (req, res) => controller.getAll(req, res))
  )

router
  .use(validateToken)
  .post(
    '/',
    validateRequest({ bodySchema: timetableSchema }),
    asyncHandler(async (req, res) => controller.create(req, res))
  )

  .put(
    '/:id',
    validateRequest({ paramsSchema: idParamSchema, bodySchema: timetableSchema }),
    asyncHandler(async (req, res) => controller.update(req, res))
  )

  .delete(
    '/:id',
    validateRequest({ paramsSchema: idParamSchema }),
    asyncHandler(async (req, res) => controller.delete(req, res))
  );
  
module.exports = { timetableRoutes: router };
