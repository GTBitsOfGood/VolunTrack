import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Organization from "../../../../server/mongodb/models/Organization";
import { organizationInputValidator } from "../../../validators/organizations";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      // uncomment this and use data to filter in case we need to
      // const organizationData = req.query as Partial<OrganizationData>;
      return res
        .status(200)
        .json({ success: true, organizations: await Organization.find() });
    }
    case "POST": {
      const result = organizationInputValidator.safeParse(req.body);
      if (!result.success) return res.status(400).json(result);

      return res.status(201).json({
        success: true,
        organization: await Organization.create(result.data),
      });
    }
  }
};
