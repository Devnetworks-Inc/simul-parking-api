const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
  {
    time: {
      type: String,
      required: true
    },
    route: {
      type: mongoose.Schema.ObjectId,
      ref: 'route',
      required: true
    }
  },
  {
    collection: 'timetable',
    timestamps: false
  }
);

const TimetableEntity = mongoose.model('timetable', timetableSchema);
module.exports = { TimetableEntity };
