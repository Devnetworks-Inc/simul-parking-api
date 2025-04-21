const { authRoutes } = require('../features/auth/router/auth.router');
const { healthRoutes } = require('./health-routes');

const BASE_PATH = '/api';

module.exports = (app) => {
  const routes = () => {
    useHealthRoutes(app);
    app.use(`${BASE_PATH}/auth`, authRoutes)
  };
  routes();
};

function useHealthRoutes(app) {
  app.use('', healthRoutes.health());
  app.use('', healthRoutes.env());
}
