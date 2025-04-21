const mongoose = require('mongoose');
const APP_MESSAGES = require('../../shared/messages/app-messages');
const { config } = require('../../configs/config');

class MongoDB {
  constructor() {
    this._connection = null;
  }

  get connection() {
    return this._connection;
  }

  async connect() {
    try {
      const mongoUri = config.MONGO_URI;

      this._connection = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log(APP_MESSAGES.MONGO_CONNECTED);
    } catch (error) {
      console.error(APP_MESSAGES.MONGO_CONNECTION_FAILED, error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log(APP_MESSAGES.MONGO_DISCONNECTED);
    } catch (error) {
      console.error(APP_MESSAGES.MONGO_DISCONNECTION_FAILED, error);
      throw error;
    }
  }
}

module.exports = MongoDB;
