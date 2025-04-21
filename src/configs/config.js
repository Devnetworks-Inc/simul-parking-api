const dotenv = require('dotenv');

dotenv.config({});

class Config {
  constructor() {
    this.MONGO_URI = process.env.MONGO_URI || this.DEFAULT_MONGO_URI;
    this.NODE_ENV = process.env.NODE_ENV || 'dev';
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || this.SECRET_KEY_ONE;
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || this.SECRET_KEY_TWO;
    this.JWT_TOKEN = process.env.JWT_TOKEN || this.JWT_TOKEN;

  }

  DEFAULT_MONGO_URI = 'mongodb://127.0.0.1:27017/parking';
  SECRET_KEY_ONE = 'njfg5894';
  SECRET_KEY_TWO = 'j39dk';
  JWT_TOKEN = 'w90234urjkdfsj';

}

const config = new Config();
module.exports = { config };
