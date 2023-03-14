const mongoose = require("mongoose");

// define schema for user collection (user model)
const userDataSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      default: "volunteer",
      enum: ["admin", "volunteer", "manager"],
    },
    status: {
      type: String,
      default: "new",
      enum: ["has_volunteered", "new"],
    },
    mandated: {
      type: String,
      default: "not_mandated",
      enum: ["is_mandated", "not_mandated"],
    },
    mandatedHours: {
      type: Number,
      default: 0,
    },
    bio: {
      first_name: { type: String },
      last_name: { type: String },
      phone_number: { type: String },
      email: { type: String, index: true, unique: true },
      date_of_birth: { type: String },
      zip_code: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      notes: { type: String },
    },
    history: { type: String },
    employment: {
      industry: { type: String },
      occupation: { type: [String] },
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: "63d6dcc4e1fb5fd6e69b1738",
    },
  },
  {
    timestamps: true,
  }
);

userDataSchema.virtual("name").get(function () {
  return this.bio.first_name + this.bio.last_name;
});

userDataSchema.virtual("age").get(function () {
  const current = new Date();
  return current.getFullYear() - this.bio.date_of_birth.getFullYear();
});

// export user model to app
module.exports =
  mongoose.models.UserData || mongoose.model("UserData", userDataSchema);
module.exports.UserDataSchema = userDataSchema;
