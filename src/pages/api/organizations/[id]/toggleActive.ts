import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../../server/mongodb";
import Organization from "../../../../../server/mongodb/models/Organization";

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
      await organization.updateOne({ $set: { active: !organization.active }});
      return res.status(200).json({ organization });
    }
  }
};
