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
    passwordHash: { type: String },
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