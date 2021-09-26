const mongoose = require('mongoose');

// define schema
const shiftSchema = new mongoose.Schema(
  {
    start_time: {
      type: Number,
      required: true
    },
    end_time: {
      type: Number,
      required: true
    },
    max_volunteers: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

// export shift model to app
module.exports = mongoose.model('Shift', eventSchema);
module.exports.ShiftSchema = shiftSchema;
