import { Model, model, models, Schema, Types } from "mongoose";

export type UserData = {
  email: string;
  organizationId: Types.ObjectId;
  role: "admin" | "volunteer" | "manager";
  status: "has_volunteered" | "new";
  firstName?: string;
  lastName?: string;
  phone?: string;
  dob?: string;
  zip?: string;
  address?: string;
  city?: string;
  state?: string;
  notes?: string;
  passwordHash?: string;
  imageUrl: string;
  isBitsOfGoodAdmin: boolean;
};

const userSchema = new Schema<UserData>(
  {
    email: { type: String, index: true, unique: true, required: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: "63d6dcc4e1fb5fd6e69b1738",
    },
    role: {
      type: String,
      enum: ["admin", "volunteer", "manager"],
      default: "volunteer",
    },
    status: {
      type: String,
      default: "new",
      enum: ["has_volunteered", "new"],
    },
    firstName: String,
    lastName: String,
    phone: String,
    dob: String,
    zip: String,
    address: String,
    city: String,
    state: String,
    notes: String,
    passwordHash: String,
    imageUrl: { type: String, default: "/images/gradient-avatar.png" },
    isBitsOfGoodAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default ("User" in models
  ? (models.User as Model<UserData>)
  : undefined) ?? model<UserData>("User", userSchema);
