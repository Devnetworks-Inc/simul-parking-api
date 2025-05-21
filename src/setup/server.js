const compression = require('compression');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const cors = require('cors');
const express = require('express');
const actuator = require('express-actuator');
const helmet = require('helmet');
const HTTP_STATUS = require('http-status-codes');
const { errorHandler } = require('../libs/core/error/error-handler');
const { config } = require('../configs/config');
const appRoute = require('../routes/routes');
const { asyncHandler } = require('../libs/core/handlers/async.handler');
const { StripeController } = require('../features/stripe/controller/stripe.controller');
const { stripeRoutes } = require('../features/stripe/router/stripe.router');
const { webhookRoutes } = require('../features/stripe/router/webhook.router');

const stripeController = new StripeController()

class ServerSetup {
  constructor(app) {
    this.app = app;
  }

  start() {
    this._configureSecurityMiddleware(this.app);
    this._configureMiddleware(this.app);
    this._configureRoutes(this.app);
    this._configureGlobalErrorHandler(this.app);
  }

  _configureSecurityMiddleware(app) {
    app.set('trust proxy', 1);
    app.use(cookieSession({
      name: 'session',
      keys: [config.SECRET_KEY_ONE, config.SECRET_KEY_TWO],
      maxAge: 24 * 7 * 3600000,
      secure: config.NODE_ENV !== 'development'
    }));
    app.use(helmet());
    app.use(cors({
      origin: '*',
      credentials: true,
      optionsSuccessStatus: 200,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    }));
  }

  _configureMiddleware(app) {
    app.use('/api/webhook', webhookRoutes),
    app.use(compression());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.use(cookieParser());
    app.use(actuator());
  }

  _configureRoutes(app) {
    appRoute(app);
  }

  _configureGlobalErrorHandler(app) {
    app.all('*', (req, res) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
    });

    app.use((error, _req, res, next) => {
      if (res.headersSent) {
        return next(error);
      }
      errorHandler.handleError(error, res);
    });
  }
}

module.exports = { ServerSetup };
