import mongoose from "mongoose";
const { Schema } = mongoose;

// Schema for User model
const userSchema = new Schema(
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
    mandatedEvents: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
      default: [],
    },
    bio: {
      first_name: { type: String },
      last_name: { type: String },
      phone_number: { type: String },
      email: { type: String, index: true, unique: true },
      date_of_birth: { type: String },
      zip_code: { type: String },
      total_hours: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
    },
    history: { type: String },
    employment: {
      industry: { type: String },
      occupation: { type: [String] },
    },
    imageUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

userSchema
  .virtual("name")
  .get(() => `${this.bio.first_name} ${this.bio.last_name}`);

userSchema.virtual("age").get(() => {
  const current = new Date();
  return current.getFullYear() - this.bio.date_of_birth.getFullYear();
});

// export user model to app
module.exports =
  mongoose.models.User || mongoose.model("User", userSchema, "users");
