import {
  HydratedDocument,
  InferSchemaType,
  Model,
  model,
  models,
  Schema,
} from "mongoose";
export * from "./validators";

export const eventParentSchema = new Schema(
  {
    title: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    localTime: { type: String, default: "EDT" },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    eventContactPhone: { type: String, required: true },
    eventContactEmail: { type: String, required: true },
    maxVolunteers: { type: Number, required: true },
    isPrivate: { type: Boolean, default: false },
    isValidForCourtHours: { type: Boolean, default: false },
    isNotifyAdmin: { type: Boolean, default: false },
    sendReminderEmail: { type: Boolean, default: false },
    requiresApproval: { type: Boolean, default: false },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: "63d6dcc4e1fb5fd6e69b1738",
      required: true,
    },
    pocName: String,
    pocEmail: String,
    pocPhone: String,
    orgName: String,
    orgAddress: String,
    orgCity: String,
    orgState: String,
    orgZip: String,
    description: String,
    tasks: [{ type: String }],
  },
  { timestamps: true }
);
export type EventParentData = InferSchemaType<typeof eventParentSchema>;

export type EventParentDocument = HydratedDocument<EventParentData>;

// Need to disable in order to check that "models" is defined
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export default (models && "EventParent" in models
  ? (models.EventParent as Model<EventParentData>)
  : undefined) ?? model<EventParentData>("EventParent", eventParentSchema);
