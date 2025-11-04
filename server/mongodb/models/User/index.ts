import {
  HydratedDocument,
  InferSchemaType,
  Model,
  model,
  models,
  Schema,
} from "mongoose";
export * from "./validators";

const userSchema = new Schema(
  {
    email: { type: String, index: true, unique: true, required: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
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
    applicationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // Existing users default to approved
    },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    rejectionReason: { type: String },
    firstTimeLogin: { type: Boolean, default: false }, // Existing users won't see welcome page
    applicationResponses: {
      type: [
        {
          question: { type: String },
          type: { type: String },
          response: { type: Schema.Types.Mixed }, // Can be string, array, etc.
          required: { type: Boolean },
        },
      ],
      default: [],
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
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
type UserData = InferSchemaType<typeof userSchema>;

export type UserDocument = HydratedDocument<UserData>;

// Need to disable in order to check that "models" is defined
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export default (models && "User" in models
  ? (models.User as Model<UserData>)
  : undefined) ?? model<UserData>("User", userSchema);
