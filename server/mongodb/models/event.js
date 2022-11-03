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
    localTime: {
      type: String,
      required: true,
      default: "EDT",
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: Number,
      required: true,
    },
    // ------ event contact ------
    eventContactPhone: {
      type: String,
      required: true,
    },
    eventContactEmail: {
      type: String,
      required: true,
    },
    // ------ group events only ------
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
    orgName: {
      type: String,
      required: false,
    },
    orgAddress: {
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
    // ------ end of group events only ------
    volunteers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserData" }],
      required: true,
      default: [],
    },
    minors: {
      type: [
        {
          volunteer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserData",
          },
          minor: [{ type: String }],
        },
      ],
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
      required: false,
    },
    isPrivate: {
      type: String,
      required: true,
    },
    isEnded: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// export Event model to app
module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
