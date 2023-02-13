const mongoose = require("mongoose");

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
    // optional fields, every field won't go on every HistoryEvent document
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.HistoryEvent ||
  mongoose.model("HistoryEvent", historyEventSchema);
