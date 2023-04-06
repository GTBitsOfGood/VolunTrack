const mongoose = require("mongoose");

// define schema
const resetcodeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// export Event model to app
module.exports =
  mongoose.models.ResetCode || mongoose.model("ResetCode", resetcodeSchema);
