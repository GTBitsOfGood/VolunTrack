import mongoose from "mongoose";

// define schema
const AppSettings = new mongoose.Schema(
  {
    invitedAdmins: [{ type: String }]
  },
  { timestamps: true }
);

// export model to app
module.exports = mongoose.models.AppSettings || mongoose.model("AppSettings", AppSettings);