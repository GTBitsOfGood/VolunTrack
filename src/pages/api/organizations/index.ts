import { HydratedDocument, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import Organization, {
  OrganizationData,
} from "../../../../server/mongodb/models/Organization";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<
    | { organizations: HydratedDocument<OrganizationData>[] }
    | { organizationId: Types.ObjectId }
  >
) => {
  switch (req.method) {
    case "GET": {
      // uncomment this and use data to filter in case we need to
      // const organizationData = req.query as Partial<OrganizationData>;

      return res.status(200).json({ organizations: await Organization.find() });
    }
    case "POST": {
      const organizationData = req.body as OrganizationData;

      const organization = await Organization.create(organizationData);
      return res.status(201).json({ organizationId: organization._id });
    }
  }
};
