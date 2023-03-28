import { Model, model, models, Schema, Types } from "mongoose";

export type UserData = {
  email: string;
  role: "admin" | "volunteer" | "manager";
  status: "has_volunteered" | "new";
  organization: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dob?: string;
  zip?: string;
  address?: string;
  city?: string;
  state?: string;
  notes?: string;
  passwordHash?: string;
  imageUrl?: string;
  isBitsOfGoodAdmin?: boolean;
};

const userSchema = new Schema<UserData>(
  {
    email: { type: String, index: true, unique: true, required: true },
    role: {
      type: String,
      enum: ["admin", "volunteer", "manager"],
      default: "volunteer",
      required: true,
    },
    status: {
      type: String,
      default: "new",
      enum: ["has_volunteered", "new"],
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: "63d6dcc4e1fb5fd6e69b1738",
      required: true,
    },
    firstName: String,
    lastName: String,
    phoneNumber: String,
    dob: String,
    zip: String,
    address: String,
    city: String,
    state: String,
    notes: String,
    passwordHash: String,
    imageUrl: String,
    isBitsOfGoodAdmin: Boolean,
  },
  {
    timestamps: true,
  }
);

export default ("User" in models
  ? (models.User as Model<UserData>)
  : undefined) ?? model<UserData>("User", userSchema);
