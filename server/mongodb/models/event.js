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
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// export Event model to app
module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
