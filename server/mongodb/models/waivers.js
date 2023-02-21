const mongoose = require("mongoose");

// define schema
const waiverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: false,
    },
    img: {
      data: Buffer,
      contentType: String,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: mongoose.Types.ObjectId("63d6dcc4e1fb5fd6e69b1738"),
    },
  },
  { timestamps: true }
);

// export Event model to app
module.exports =
  mongoose.models.Waiver || mongoose.model("Waiver", waiverSchema);
