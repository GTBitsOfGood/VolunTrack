import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import Organization from "../../../../../server/mongodb/models/Organization";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<
    { invitedAdmins?: string[] } | { organizationId?: Types.ObjectId }
  >
) => {
  const id = req.query.id as string;
  const organization = await Organization.findById(new Types.ObjectId(id));
  if (!organization) {
    return res.status(404);
  }

  switch (req.method) {
    case "GET": {
      return res
        .status(200)
        .json({ invitedAdmins: organization.invitedAdmins });
    }
    case "POST": {
      const email = req.body as string;

      await organization.updateOne({ $push: { invitedAdmins: email } });
      return res.status(200).json({ organizationId: organization._id });
    }
    case "DELETE": {
      const { data: email } = req.body as { data: string };

      await organization.updateOne({ $pull: { invitedAdmins: email } });
      return res.status(200).json({ organizationId: organization._id });
    }
  }
};
