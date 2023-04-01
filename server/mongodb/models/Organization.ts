import { Model, model, models, Schema } from "mongoose";
import { z } from "zod";

export const organizationValidator = z.object({
  name: z.string(),
  url: z.string(),
  imageUrl: z.string(),
  notificationEmail: z.string(),
  slug: z.string(),
  theme: z.string(),
  defaultEventState: z.string(),
  defaultEventCity: z.string(),
  defaultEventAddress: z.string(),
  defaultEventZip: z.string(),
  defaultContactName: z.string(),
  defaultContactEmail: z.string(),
  defaultContactPhone: z.string(),
  invitedAdmins: z.string().array().optional(),
  originalAdminEmail: z.string(),
  active: z.boolean(),
  eventSilver: z.number().optional(),
  eventGold: z.number().optional(),
  hoursSilver: z.number().optional(),
  hoursGold: z.number().optional(),
});

export type OrganizationData = z.infer<typeof organizationValidator>;

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
