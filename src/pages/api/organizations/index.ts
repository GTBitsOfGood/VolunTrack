import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Organization, {
  organizationInputCreationValidator,
} from "../../../../server/mongodb/models/Organization";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { createHistoryEventOrganizationSettingsUpdated } from "../../../../server/actions/historyEvent";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      // uncomment this and use data to filter in case we need to
      // const organizationData = req.query as Partial<OrganizationData>;
      return res.status(200).json({ organizations: await Organization.find() });
    }
    case "POST": {
      const result = organizationInputCreationValidator.safeParse(req.body);
      if (!result.success) return res.status(400).json(result);

      result.data.notificationEmail = result.data.originalAdminEmail;
      result.data.invitedAdmins = [result.data.originalAdminEmail];
      const session = await getServerSession(req, res, authOptions);
      if (!session?.user)
        return res
          .status(400)
          .json({ error: "User session not found to create event" });
      const user = session.user;
      await createHistoryEventOrganizationSettingsUpdated(user);
      return res.status(201).json({
        organization: await Organization.create(result.data),
      });
    }
  }
};
