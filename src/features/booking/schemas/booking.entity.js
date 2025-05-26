const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    departureAirport: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },

    parkingId: {
      type: String,
      required: true
    },
    isServices: {
      type: Boolean,
      default: false
    },
    totalAmount: {
      type: Number,
      default: 0,
      require: true
    },
    parkingEstablishmentId: {
      type: String,
      required: true
    },
    parkingName: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['paid', 'processing', 'failed'],
      default: 'processing'
    },
    bookingDate: Date,
    checkoutSessionId: String,
    checkoutSessionPaymentDate: Date,
    checkoutSessionFailedDate: Date,
  },
  {
    collection: 'bookingDetail',
    timestamps: false
  }
);

const BookingDetailsEntity = mongoose.model('BookingDetail', BookingSchema);
module.exports = { BookingDetailsEntity };
