const mongoose = require("mongoose");

// define schema
const historyEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    keyword: {
      type: String,
    },
    description: {
      type: String,
      default: "",
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  },
  { timestamps: true }
);

// export Event model to app

module.exports =
  mongoose.models.HistoryEvent ||
  mongoose.model("HistoryEvent", historyEventSchema);
