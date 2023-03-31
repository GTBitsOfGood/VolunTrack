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

  invitedAdmins: [{ type: string }];
  originalAdminEmail: string;
  active: boolean;

  eventSilver: number;
  eventGold: number;
  hoursSilver: number;
  hoursGold: number;
};

const organizationSchema = new Schema<OrganizationData>(
  {
    name: String,
    url: String,
    imageUrl: String,
    notificationEmail: String,
    slug: String,
    theme: { type: String, default: "magenta" },

    defaultEventState: String,
    defaultEventCity: String,
    defaultEventAddress: String,
    defaultEventZip: String,

    defaultContactName: String,
    defaultContactEmail: String,
    defaultContactPhone: String,

    invitedAdmins: [{ type: String }],
    originalAdminEmail: String,
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
