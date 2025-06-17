const mongoose = require('mongoose');

const shuttleBookingSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    pickupAddress: {
      type: String,
      required: true
    },
    destinationAddress: {
      type: String,
      required: true
    },
    pickupDatetime: {
      type: Date,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    note: {
      type: String,
      required: false
    },
    seats: {
      type: Number,
      required: true
    },
    parkingBookingId: {
      type: mongoose.ObjectId,
      required: true,
    },
    parkingId: {
      type: mongoose.ObjectId,
      required: true,
    },
    route: {
      type: String,
      enum: ['parking-airport', 'airport-parking'],
    }
  },
  {
    collection: 'shuttleBooking',
    timestamps: true
  }
);

const ShuttleBookingEntity = mongoose.model('ShuttleBooking', shuttleBookingSchema);
module.exports = { ShuttleBookingEntity };
