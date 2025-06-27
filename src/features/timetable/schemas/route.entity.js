const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['parking-airport', 'airport-parking'],
      required: true,
    },
    parking: {
      type: mongoose.Schema.ObjectId,
      ref: 'parking',
      required: true,
    },
    airport: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'route',
    timestamps: false,
  }
);

const RouteEntity = mongoose.model('route', routeSchema);
module.exports = { RouteEntity };