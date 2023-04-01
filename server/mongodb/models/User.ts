import { Model, model, models, Schema, Types } from "mongoose";
import { z } from "zod";

export const userValidator = z.object({
  email: z.string().email(),
  organizationId: z.instanceof(Types.ObjectId),
  role: z.enum(["admin", "volunteer", "manager"]).optional(),
  status: z.enum(["has_volunteered", "new"]).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  dob: z.string().optional(),
  zip: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  notes: z.string().optional(),
  passwordHash: z.string().optional(),
  imageUrl: z.string().optional(),
  isBitsOfGoodAdmin: z.boolean().optional(),
  password: z.string().optional(),
});

export type UserData = z.infer<typeof userValidator>;

const userSchema = new Schema<UserData>(
  {
    email: { type: String, index: true, unique: true, required: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: "63d6dcc4e1fb5fd6e69b1738",
      required: true,
    },
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
