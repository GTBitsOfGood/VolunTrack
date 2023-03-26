const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: String,
    website: String,
    imageURL: String,
    notificationEmail: String,
    slug: String,
    theme: { type: String, default: "red" },

    defaultEventState: String,
    defaultEventCity: String,
    defaultEventAddress: String,
    defaultEventZip: String,

    defaultContactName: String,
    defaultContactEmail: String,
    defaultContactPhone: String,

    invitedAdmins: [{ type: String }],
    originalAdminEmail: String,
    active: { type: Boolean, default: false },

    eventSilver: { type: Number, default: 4 },
    eventGold: { type: Number, default: 8 },
    hoursSilver: { type: Number, default: 20 },
    hoursGold: { type: Number, default: 40 },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Organization ||
  mongoose.model("Organization", organizationSchema);
