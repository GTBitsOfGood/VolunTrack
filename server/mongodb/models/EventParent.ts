import { Document, model, Model, models, Schema } from "mongoose";
import { z } from "zod";

export const eventParentValidator = z.object({
  title: z.string(),
  startTime: z.string().regex(new RegExp(/^\d{2}:\d{2}$/)),
  endTime: z.string().regex(new RegExp(/^\d{2}:\d{2}$/)),
  localTime: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string().regex(new RegExp(/^[A-Z]{2}$/)),
  zip: z.string().regex(new RegExp(/^\d{5}$/)),
  eventContactPhone: z.string(),
  eventContactEmail: z.string().email(),
  maxVolunteers: z.number(),
  isPrivate: z.boolean(),
  isValidForCourtHours: z.boolean(),
  pocName: z.string().optional(),
  pocEmail: z.string().email().optional(),
  pocPhone: z.string().optional(),
  orgName: z.string().optional(),
  orgAddress: z.string().optional(),
  orgCity: z.string().optional(),
  orgState: z
    .string()
    .regex(new RegExp(/^[A-Z]{2}$/))
    .optional(),
  orgZip: z
    .string()
    .regex(new RegExp(/^\d{5}$/))
    .optional(),
  description: z.string().optional(),
  organizationId: z.instanceof(Schema.Types.ObjectId),
});

export interface EventParentData extends z.infer<typeof eventParentValidator> {}
export interface EventParentDocument extends EventParentData, Document {}

interface EventParentModel extends Model<EventParentDocument> {}

const eventParentSchema = new Schema<EventParentDocument, EventParentModel>(
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
    pocName: String,
    pocEmail: String,
    pocPhone: String,
    orgName: String,
    orgAddress: String,
    orgCity: String,
    orgState: String,
    orgZip: String,
    description: String,
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: "63d6dcc4e1fb5fd6e69b1738",
    },
  },
  { timestamps: true }
);

export default ("EventParent" in models
  ? (models.EventParent as EventParentModel)
  : undefined) ??
  model<EventParentDocument, EventParentModel>(
    "EventParent",
    eventParentSchema
  );
