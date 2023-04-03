import { Model, model, models, Schema, Types } from "mongoose";

export type EventParentData = {
  title: string;
  startTime: string;
  endTime: string;
  localTime: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  eventContactPhone: string;
  eventContactEmail: string;
  maxVolunteers: number;
  isPrivate: boolean;
  isValidForCourtHours: boolean;
  organizationId: Types.ObjectId;
  pocName?: string;
  pocEmail?: string;
  pocPhone?: string;
  orgName?: string;
  orgAddress?: string;
  orgCity?: string;
  orgState?: string;
  orgZip?: string;
  description?: string;
};

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
