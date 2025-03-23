import { NextApiRequest, NextApiResponse } from "next/types";
import { z } from "zod";
import dbConnect from "../../../../../server/mongodb";
import Organization from "../../../../../server/mongodb/models/Organization";
import { createHistoryEventInviteAdmin } from "../../../../../server/actions/historyEvent";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
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
        return res
          .status(403)
          .json({ error: "Only Admins can see invited admins" });
      }
      return res
        .status(200)
        .json({ invitedAdmins: organization.invitedAdmins });
    }
    case "POST": {
      const isadmin = await isAdmin(req, res);
      if (!isadmin) {
        return res
          .status(403)
          .json({ error: "Only Admins can see add other admins" });
      }
      const { data: email } = req.body as { data: string };
      const result = z.string().email().safeParse(email);

      if (result.success) {
        const session = await getServerSession(req, res, authOptions);
        if (!session?.user)
          return res
            .status(400)
            .json({ error: "User session not found to create event" });
        const user = session.user;
        await organization.updateOne({
          $push: { invitedAdmins: email },
        });
        await createHistoryEventInviteAdmin(user, email);
        return res
          .status(200)
          .json({ invitedAdmins: organization.invitedAdmins });
      }
      return res.status(400).json({ error: "Invalid email" });
    }
    case "DELETE": {
      const isadmin = await isAdmin(req, res);
      if (!isadmin) {
        return res.status(403).json({ error: "Only Admins can delete admins" });
      }
      const email = req.body as string;

      if (z.string().email().safeParse(email).success) {
        await organization.updateOne({ $pull: { invitedAdmins: email } });
        return res
          .status(200)
          .json({ invitedAdmins: organization.invitedAdmins });
      }
      return res.status(400).json({ error: "Invalid email" });
    }
  }
};
