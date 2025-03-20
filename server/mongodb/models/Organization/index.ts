import {
  HydratedDocument,
  InferSchemaType,
  Model,
  model,
  models,
  Schema,
} from "mongoose";
export * from "./validators";

const organizationSchema = new Schema(
  {
    name: { type: String, required: true },
    website: { type: String, required: true },
    imageUrl: { type: String, required: false },
    notificationEmail: { type: String, required: false },
    slug: { type: String, required: true },
    theme: { type: String, default: "magenta" },
    defaultEventState: { type: String, required: false },
    defaultEventCity: { type: String, required: false },
    defaultEventAddress: { type: String, required: false },
    defaultEventZip: { type: String, required: false },
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
    homePage: { type: String, required: false, default: "" },
    aboutPageToggle: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);
type OrganizationData = InferSchemaType<typeof organizationSchema>;

export type OrganizationDocument = HydratedDocument<OrganizationData>;

// Need to disable in order to check that "models" is defined
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export default (models && "Organization" in models
  ? (models.Organization as Model<OrganizationData>)
  : undefined) ?? model<OrganizationData>("Organization", organizationSchema);
