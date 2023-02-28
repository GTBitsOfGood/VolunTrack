const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: String,
    website: String,
    slug: String,
    invitedAdmins: [{ type: String }],
    defaultContactName: String,
    defaultContactEmail: String,
    defaultContactPhone: String,
    originalAdminEmail: String,
    active: Boolean,
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Organization ||
  mongoose.model("Organization", organizationSchema);
