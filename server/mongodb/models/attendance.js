const mongoose = require("mongoose");

// define schema
const attendanceSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

// export Event model to app

module.exports =
  mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
