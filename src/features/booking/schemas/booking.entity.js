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
    // Date with time 
    startDatetime: {
      type: Date,
      required: true
    },
    // Date without time
    startDate: {
      type: Date,
      required: true
    },
    // Hour only
    startTimeHour: {
      type: Number,
      required: true
    },
    // Minute only
    startTimeMinute: {
      type: Number,
      required: true
    },
    endDatetime: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    endTimeHour: {
      type: Number,
      required: true
    },
     endTimeMinute: {
      type: Number,
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
      type: mongoose.ObjectId,
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
    bookingDate: {
      type: Date,
      required: true
    },
    parkingPrice: {
      type: Number,
      required: false
    },
    schemaVersion: {
      type: Number,
      default: 2
    },
    vehicleNumber: String,
    parkingSpaceLocation: String,
    isVehiclePickedUp: Boolean,
    vehiclePickedUpDate: Date,
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
