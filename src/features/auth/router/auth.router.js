const { Router } = require('express');
const { asyncHandler } = require('../../../libs/core/handlers/async.handler');
const { AuthController } = require('../controller/auth.cotroller');

const controller = new AuthController();
const router = Router();

router
  .post(
    '/',
    asyncHandler(async (req, res) => controller.create(req, res))
  )
  .post(
    '/login',
    asyncHandler(async (req, res) => controller.login(req, res))
  );
  
module.exports = { authRoutes: router };
