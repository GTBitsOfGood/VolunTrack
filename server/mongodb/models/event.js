const mongoose = require("mongoose");

// define schema
const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    contact_phone: {
      type: String,
      require: false,
    },
    contact_email: {
      type: String,
      required: false,
    },
    volunteers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserData" }],
      default: [],
    },
    shifts: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shift" }],
      default: [],
    },
    shifts: {
      type: [
        {
          start_time: String,
          end_time: String,
          max_volunteers: Number,
        },
      ],
      default: [],
      required: true,
    },
  },
  { timestamps: true }
);

// export Event model to app
module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
