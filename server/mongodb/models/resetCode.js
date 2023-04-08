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
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Code expires after 900 seconds (15 minutes)
mongoose.connection
  .collection("resetcodes")
  .createIndex({ createdAt: 1 }, { expireAfterSeconds: 900 });

// export ResetCode model to app
module.exports =
  mongoose.models.ResetCode || mongoose.model("ResetCode", resetcodeSchema);
