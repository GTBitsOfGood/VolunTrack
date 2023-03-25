const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: String,
    website: String,
    imageURL: String,
    notificationEmail: String,
    slug: String,
    primaryColor: String,
    secondaryColor: String,

    defaultEventState: String,
    defaultEventCity: String,
    defaultEventAddress: String,
    defaultEventZip: String,

    defaultContactName: String,
    defaultContactEmail: String,
    defaultContactPhone: String,

    invitedAdmins: [{ type: String }],
    originalAdminEmail: String,
    active: Boolean,

    eventSilver: Number,
    eventGold: Number,
    hoursSilver: Number,
    hoursGold: Number,
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Organization ||
  mongoose.model("Organization", organizationSchema);
