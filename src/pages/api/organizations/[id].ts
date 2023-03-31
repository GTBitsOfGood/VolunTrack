import { HydratedDocument, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Organization, {
  OrganizationData,
} from "../../../../server/mongodb/models/Organization";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<
    | { organization?: HydratedDocument<OrganizationData> }
    | { organizationId?: Types.ObjectId }
  >
) => {
  await dbConnect();

  const id = req.query.id as string;
  const organization = await Organization.findById(id);
  if (!organization) return res.status(404);

  switch (req.method) {
    case "GET": {
      return res.status(200).json({ organization });
    }
    case "PUT": {
      const userData = req.body as Partial<OrganizationData>;
      await organization.updateOne(userData);
      return res.status(200).json({ organizationId: organization._id });
    }
    case "DELETE": {
      await organization.deleteOne();
      return res.status(200).json({ organizationId: organization._id });
    }
  }
};
