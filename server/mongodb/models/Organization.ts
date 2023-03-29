import { Model, model, models, Schema } from "mongoose";
import dbConnect from "../";
import {
  documentMiddleware,
  documentOrQueryMiddleware,
  queryMiddleware,
} from "../middleware";

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
organizationSchema.pre(documentMiddleware, async () => await dbConnect());
organizationSchema.pre(queryMiddleware, async () => await dbConnect());
organizationSchema.pre(
  documentOrQueryMiddleware,
  async () => await dbConnect()
);

export default ("Organization" in models
  ? (models.Organization as Model<OrganizationData>)
  : undefined) ?? model<OrganizationData>("Organization", organizationSchema);
