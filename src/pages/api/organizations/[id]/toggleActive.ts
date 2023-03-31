import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../../server/mongodb";
import Organization from "../../../../../server/mongodb/models/Organization";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<
    { invitedAdmins?: string[] } | { organizationId?: Types.ObjectId }
  >
) => {
  await dbConnect();

  const id = req.query.id as string;
  const organization = await Organization.findById(new Types.ObjectId(id));
  if (!organization) {
    return res.status(404);
  }

  switch (req.method) {
    case "POST": {
      await organization.updateOne({ active: !organization.active });
      return res.status(200).json({ organizationId: organization._id });
    }
  }
};
