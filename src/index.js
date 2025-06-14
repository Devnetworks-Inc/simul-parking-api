const express = require('express');
require('reflect-metadata');
const { ServerSetup } = require('./setup/server');
const http = require('http');
const { errorHandler } = require('./libs/core/error/error-handler');
const MongoDB = require('./libs/database/db');
const { config } = require("./configs/config");
process.env.TZ = 'Europe/Berlin'

const app = express();
const server = http.createServer(app);

class Application {
  initialize() {
    console.log('Initializing application...');
    this._initSetup();
    const serverSetup = new ServerSetup(app);
    serverSetup.start();
    this._startHttpServer();
  }

  _initSetup() {
    this._connectDB();
  }

  _connectDB() {
    new MongoDB().connect();
  }

  _startHttpServer() {
    console.log(`Worker with process id of ${process.pid} has started...`);
    server.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  
    process.on('unhandledRejection', (reason) => {
      throw reason;
    });
  
    process.on('uncaughtException', (error) => {
      errorHandler.handleError(error);
      if (!errorHandler.isTrustedError(error)) {
        process.exit(1);
      }
    });
  }
}

const application = new Application();
application.initialize();
