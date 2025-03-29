import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../../server/mongodb";
import Organization from "../../../../../server/mongodb/models/Organization";
import { isAdmin } from "../../../../utils/routeProtection";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const organizationId = req.query.id as string;
  const organization = await Organization.findById(organizationId);
  if (!organization) {
    return res.status(404).json({
      error: `Organization with id ${organizationId} not found`,
    });
  }

  switch (req.method) {
    case "GET": {
      const isadmin = await isAdmin(req, res);
      if (!isadmin) {
        return res.status(403).json({
          error: "Only Admins can access the organization's original admin",
        });
      }
      return res
        .status(200)
        .json({ originalAdminEmail: organization.originalAdminEmail });
    }
  }
};
