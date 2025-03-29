import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../../server/mongodb";
import Organization from "../../../../../server/mongodb/models/Organization";
import { isBoGAdmin } from "../../../../utils/routeProtection";

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
    case "POST": {
      const isbogadmin = await isBoGAdmin(req, res);
      if (!isbogadmin) {
        return res.status(403).json({
          error: "Only the BoG admins can toggle organization active status",
        });
      }
      await organization.updateOne({ $set: { active: !organization.active } });
      return res.status(200).json({ organization });
    }
  }
};
