const mongoose = require("mongoose");

// define schema
const attendanceSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    eventName: {
      type: String,
      required: true,
      default: "Event",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    volunteerName: {
      type: String,
      required: true,
      default: "Volunteer",
    },
    volunteerEmail: {
      type: String,
      required: true,
      default: "volunteer@gmail.com",
    },
    timeCheckedIn: {
      type: Date,
      required: true,
    },
    timeCheckedOut: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
