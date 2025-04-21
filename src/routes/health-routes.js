const express = require('express');
const moment = require('moment');
const axios = require('axios');
const { performance } = require('perf_hooks');
const HTTP_STATUS = require('http-status-codes');
const { config } = require('../configs/config');

class HealthRoutes {
  constructor() {
    this.router = express.Router();
  }

  health() {
    this.router.get('/_health', (req, res) => {
      res.status(HTTP_STATUS.OK).send(`Health: Server instance is healthy with process id ${process.pid} on ${moment().format('LL')}`);
    });

    return this.router;
  }

  env() {
    this.router.get('/env', (req, res) => {
      res.status(HTTP_STATUS.OK).send(`This is the ${config.NODE_ENV} environment`);
    });

    return this.router;
  }

  fiboRoutes() {
    this.router.get('/fibo/:num', async (req, res) => {
      const { num } = req.params;
      const start = performance.now();
      const result = this.fibo(parseInt(num, 10));
      const end = performance.now();
      const response = await axios({
        method: 'get',
        url: ''
      });
      res
        .status(HTTP_STATUS.OK)
        .send(
          `Fibonacci series of ${num} is ${result} and it took ${end - start}ms and runs with process id ${process.pid} on ${
            response.data
          } at ${moment().format('LL')}`
        );
    });

    return this.router;
  }

  fibo(data) {
    if (data < 2) {
      return 1;
    } else {
      return this.fibo(data - 2) + this.fibo(data - 1);
    }
  }
}

const healthRoutes = new HealthRoutes();
module.exports = { healthRoutes };
