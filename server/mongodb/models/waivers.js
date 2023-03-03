const mongoose = require("mongoose");

// define schema
const waiverSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: false,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: "63d6dcc4e1fb5fd6e69b1738",
    },
  },
  { timestamps: true }
);

// export Event model to app
module.exports =
  mongoose.models.Waiver || mongoose.model("Waiver", waiverSchema);
