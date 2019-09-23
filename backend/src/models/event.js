const mongoose = require('mongoose');

// define schema
const eventSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    },
    volunteers: {
      type: Array, // array of user objects
      default: []
    },
    max_volunteers: {
      type: Number,
      required: true
    },
    link: {
      type: String,
      required: false
    },
    additional_background_check: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

// export Event model to app
module.exports = mongoose.model('Event', eventSchema);
