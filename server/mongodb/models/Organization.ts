import { Model, model, models, Schema } from "mongoose";

export type OrganizationData = {
  name: string;
  url: string;
  imageUrl: string;
  notificationEmail: string;
  slug: string;
  theme: string;
  defaultEventState: string;
  defaultEventCity: string;
  defaultEventAddress: string;
  defaultEventZip: string;
  defaultContactName: string;
  defaultContactEmail: string;
  defaultContactPhone: string;
  invitedAdmins: string[];
  originalAdminEmail: string;
  active: boolean;
  eventSilver: number;
  eventGold: number;
  hoursSilver: number;
  hoursGold: number;
};

const organizationSchema = new Schema<OrganizationData>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    imageUrl: { type: String, required: true },
    notificationEmail: { type: String, required: true },
    slug: { type: String, required: true },
    theme: { type: String, default: "magenta" },
    defaultEventState: { type: String, required: true },
    defaultEventCity: { type: String, required: true },
    defaultEventAddress: { type: String, required: true },
    defaultEventZip: { type: String, required: true },
    defaultContactName: { type: String, required: true },
    defaultContactEmail: { type: String, required: true },
    defaultContactPhone: { type: String, required: true },
    invitedAdmins: { type: [String], default: [] },
    originalAdminEmail: { type: String, required: true },
    active: { type: Boolean, default: false },
    eventSilver: { type: Number, default: 4 },
    eventGold: { type: Number, default: 8 },
    hoursSilver: { type: Number, default: 20 },
    hoursGold: { type: Number, default: 40 },
  },
  { timestamps: true }
);

export default ("Organization" in models
  ? (models.Organization as Model<OrganizationData>)
  : undefined) ?? model<OrganizationData>("Organization", organizationSchema);
