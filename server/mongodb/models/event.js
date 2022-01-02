const mongoose = require('mongoose');

// define schema
const eventSchema = new mongoose.Schema(
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
    contact_phone: {
      type: String,
      require: false
    },
    contact_email: {
      type: String,
      required: false
    },
    volunteers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserData' }],
      default: []
    },
    max_volunteers: {
      type: Number,
      required: true
    },
    external_links: {
      type: [String],
      default: [],
      required: false
    }
  },
  { timestamps: true }
);

// export Event model to app
module.exports = mongoose.model('Event', eventSchema);
