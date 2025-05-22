const { Router, raw } = require('express');
const { asyncHandler } = require('../../../libs/core/handlers/async.handler');
const { StripeController } = require('../controller/stripe.controller');

const controller = new StripeController();
const router = Router();

router
  .post(
    '/webhook',
    raw({type: 'application/json'}),
    asyncHandler(async (req, res) => controller.webhook(req, res))
  )
  
module.exports = { stripeRoutes: router };
