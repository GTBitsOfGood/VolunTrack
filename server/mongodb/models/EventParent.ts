import { Model, model, models, Schema, Types } from "mongoose";
import { z } from "zod";

export const eventParentValidator = z.object({
  title: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  localTime: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  eventContactPhone: z.string(),
  eventContactEmail: z.string(),
  maxVolunteers: z.number(),
  isPrivate: z.boolean(),
  isValidForCourtHours: z.boolean(),
  organizationId: z.instanceof(Types.ObjectId),
  pocName: z.string().optional(),
  pocEmail: z.string().optional(),
  pocPhone: z.string().optional(),
  orgName: z.string().optional(),
  orgAddress: z.string().optional(),
  orgCity: z.string().optional(),
  orgState: z.string().optional(),
  orgZip: z.string().optional(),
  description: z.string().optional(),
});

export type EventParentData = z.infer<typeof eventParentValidator>;

const eventParentSchema = new Schema<EventParentData>(
  {
    title: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    localTime: { type: String, required: true, default: "EDT" },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    eventContactPhone: { type: String, required: true },
    eventContactEmail: { type: String, required: true },
    maxVolunteers: { type: Number, required: true },
    isPrivate: { type: Boolean, required: true },
    isValidForCourtHours: { type: Boolean, required: true, default: false },
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
  },
  { timestamps: true }
);

export default ("EventParent" in models
  ? (models.EventParent as Model<EventParentData>)
  : undefined) ?? model<EventParentData>("EventParent", eventParentSchema);
