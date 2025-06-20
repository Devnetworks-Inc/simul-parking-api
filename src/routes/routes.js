const { authRoutes } = require('../features/auth/router/auth.router');
const { bookingRoutes } = require('../features/booking/router/booking.router');
const { parkingRoutes } = require('../features/parking/router/parking.router');
const { shuttleBookingRoutes } = require('../features/shuttleBooking/router/shuttleBooking.router');
const { timetableRoutes } = require('../features/timetable/router/timetable.router');
const { healthRoutes } = require('./health-routes');

const BASE_PATH = '/api';

module.exports = (app) => {
  const routes = () => {
    useHealthRoutes(app);
    app.use(`${BASE_PATH}/booking`, bookingRoutes)
    app.use(`${BASE_PATH}/auth`, authRoutes)
    app.use(`${BASE_PATH}/parking`, parkingRoutes)
    app.use(`${BASE_PATH}/shuttle-booking`, shuttleBookingRoutes)
    app.use(`${BASE_PATH}/timetable`, timetableRoutes)
    // app.use(`${BASE_PATH}/stripe`, stripeRoutes)
  };
  routes();
};

function useHealthRoutes(app) {
  app.use('', healthRoutes.health());
  app.use('', healthRoutes.env());
}
