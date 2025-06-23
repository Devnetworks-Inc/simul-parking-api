const mongoose = require('mongoose');

const parkingSpaceSchema = new mongoose.Schema({
  spaceNumber: {
    type: String,
    required: true,
  },
  isOccupied: {
    type: Boolean,
    default: false
  },
  parkingId: {
    type: mongoose.ObjectId,
    required: true
  }
})

const parkingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    address: {
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
    },
    parkingSpaces: {
      type: [parkingSpaceSchema],
      default: []
    }
  },
  {
    collection: 'parking',
    timestamps: false
  }
);

const ParkingEntity = mongoose.model('parking', parkingSchema);
const ParkingSpaceEntity = mongoose.model('parkingSpace', parkingSpaceSchema);
module.exports = { ParkingEntity, ParkingSpaceEntity };
