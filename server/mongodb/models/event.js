const mongoose = require("mongoose");

// define schema
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: Number,
      required: true,
    },
    pocName: {
      type: String,
      required: false,
    },
    pocEmail: {
      type: String,
      required: false,
    },
    pocPhone: {
      type: Number,
      required: false,
    },
    addressLineOne: {
      type: String,
      required: false,
    },
    addressLineTwo: {
      type: String,
      required: false,
    },
    orgCity: {
      type: String,
      required: false,
    },
    orgState: {
      type: String,
      required: false,
    },
    orgZip: {
      type: Number,
      required: false,
    },
    volunteers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserData" }],
      required: true,
      default: [],
    },
    minors: {
      type: [{
        volunteer_id: { type: mongoose.Schema.Types.ObjectId, ref: "UserData" },
        minor: [{ type: String}]
      }],
      required: true,
      default: [],
    },
    max_volunteers: {
      type: Number,
      required: true,
    },
    mandated_volunteers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserData" }],
      required: true,
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// export Event model to app

module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
