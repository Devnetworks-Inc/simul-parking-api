const { healthRoutes } = require('./health-routes');

const BASE_PATH = '/api';

module.exports = (app) => {
  const routes = () => {
    useHealthRoutes(app);
    // app.use(`${BASE_PATH}/book`, authRoutes)
  };
  routes();
};

function useHealthRoutes(app) {
  app.use('', healthRoutes.health());
  app.use('', healthRoutes.env());
}
