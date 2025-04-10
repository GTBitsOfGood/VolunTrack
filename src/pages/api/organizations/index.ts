import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Organization, {
  organizationInputCreationValidator,
} from "../../../../server/mongodb/models/Organization";
import { sendOrganizationApplicationAlert } from "../../../utils/mailersend-email";
import { isBoGAdmin } from "../../../utils/routeProtection";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      // uncomment this and use data to filter in case we need to
      // const organizationData = req.query as Partial<OrganizationData>;
      // const isbogadmin = await isBoGAdmin(req, res);
      // if (!isbogadmin) {
      //   return res
      //     .status(403)
      //     .json({ error: "Only BoG Admins can view organizations" });
      // }
      return res.status(200).json({ organizations: await Organization.find() });
    }
    case "POST": {
      // const isbogadmin = await isBoGAdmin(req, res);
      // if (!isbogadmin) {
      //   return res
      //     .status(403)
      //     .json({ error: "Only BoG Admins can create organizations" });
      // }
      const result = organizationInputCreationValidator.safeParse(req.body);

      if (!result.success) {
        console.log(result.error.format());
      }
      if (!result.success) return res.status(400).json(result);

      result.data.notificationEmail = result.data.originalAdminEmail;
      result.data.invitedAdmins = [result.data.originalAdminEmail];
      await sendOrganizationApplicationAlert(
        result.data.name,
        result.data.website
      );
      return res.status(201).json({
        organization: await Organization.create(result.data),
      });
    }
  }
};
