import {
  HydratedDocument,
  InferSchemaType,
  Model,
  model,
  models,
  Schema,
} from "mongoose";
export * from "./validators";

const registrationSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: "63d6dcc4e1fb5fd6e69b1738",
      required: true,
    },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    minors: { type: [String], default: [] },
    approved: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "approved",
    },
    tasks: { type: [String], default: [] },
  },
  { timestamps: true }
);
type RegistrationData = InferSchemaType<typeof registrationSchema>;

export type RegistrationDocument = HydratedDocument<RegistrationData>;

// Need to disable in order to check that "models" is defined
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export default (models && "Registration" in models
  ? (models.Registration as Model<RegistrationData>)
  : undefined) ?? model<RegistrationData>("Registration", registrationSchema);
