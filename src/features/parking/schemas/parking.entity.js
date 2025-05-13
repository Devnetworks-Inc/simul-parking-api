const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const parkingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    rating: {
      type: String,
      required: false
    },
    transferTime: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    img: {
      type: String,
      required: false
    },
    price: {
      type: Number,
      default: 0,
      require: true
    },
    tags: {
      type: [String],
      required: false,
      default: [],
    }
  },
  {
    collection: 'parking',
    timestamps: false
  }
);

const ParkingEntity = mongoose.model('parking', parkingSchema);
module.exports = { ParkingEntity };
