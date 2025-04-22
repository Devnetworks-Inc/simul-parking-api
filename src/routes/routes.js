const { bookingRoutes } = require('../features/booking/router/booking.router');
const { healthRoutes } = require('./health-routes');

const BASE_PATH = '/api';

module.exports = (app) => {
  const routes = () => {
    useHealthRoutes(app);
    app.use(`${BASE_PATH}/booking`, bookingRoutes)
  };
  routes();
};

function useHealthRoutes(app) {
  app.use('', healthRoutes.health());
  app.use('', healthRoutes.env());
}
