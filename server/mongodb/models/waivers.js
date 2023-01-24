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
  },
  { timestamps: true }
);

// export Event model to app
module.exports =
  mongoose.models.Waiver || mongoose.model("Waiver", waiverSchema);
