const mongoose = require('mongoose');
const UserDataSchema = require('./userData').UserDataSchema;

// define schema
const eventSchema = new mongoose.Schema(
  {
    // add event id field
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
    contact_phone: {
      type: String,
      require: false
    },
    contact_email: {
      type: String,
      required: false
    },
    volunteers: {
      type: [UserDataSchema],
      default: []
    },
    max_volunteers: {
      type: Number,
      required: true
    },
    external_links: {
      type: [String],
      required: false
    }
  },
  { timestamps: true }
);

// export Event model to app
module.exports = mongoose.model('Event', eventSchema);
