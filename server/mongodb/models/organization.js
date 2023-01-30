const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: String,
    website: String,
    slug: String,
    invitedAdmins: [{ type: String }],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Organization ||
  mongoose.model("Organization", organizationSchema);
