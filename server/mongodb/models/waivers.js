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
    },
  },
  { timestamps: true }
);

// export Event model to app
module.exports =
  mongoose.models.Waiver || mongoose.model("Waiver", waiverSchema);
