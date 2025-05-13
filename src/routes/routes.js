const { authRoutes } = require('../features/auth/router/auth.router');
const { bookingRoutes } = require('../features/booking/router/booking.router');
const { parkingRoutes } = require('../features/parking/router/parking.router');
const { healthRoutes } = require('./health-routes');

const BASE_PATH = '/api';

module.exports = (app) => {
  const routes = () => {
    useHealthRoutes(app);
    app.use(`${BASE_PATH}/booking`, bookingRoutes)
    app.use(`${BASE_PATH}/auth`, authRoutes)
    app.use(`${BASE_PATH}/parking`, parkingRoutes)
  };
  routes();
};

function useHealthRoutes(app) {
  app.use('', healthRoutes.health());
  app.use('', healthRoutes.env());
}
