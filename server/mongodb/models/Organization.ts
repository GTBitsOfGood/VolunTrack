import { Model, model, models, Schema } from "mongoose";

export type OrganizationData = {
  name: string;
  url: string;
  slug: string;
  invitedAdmins: string[];
  defaultContactName: string;
  defaultContactEmail: string;
  defaultContactPhone: string;
  originalAdminEmail: string;
  active: boolean;
};

const organizationSchema = new Schema<OrganizationData>(
  {
    name: String,
    url: String,
    slug: String,
    invitedAdmins: [{ type: String }],
    defaultContactName: String,
    defaultContactEmail: String,
    defaultContactPhone: String,
    originalAdminEmail: String,
    active: Boolean,
  },
  { timestamps: true }
);

export default ("Organization" in models
  ? (models.Organization as Model<OrganizationData>)
  : undefined) ?? model<OrganizationData>("Organization", organizationSchema);
