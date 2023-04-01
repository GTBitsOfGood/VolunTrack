import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Organization, {
  OrganizationData,
  organizationValidator,
} from "../../../../server/mongodb/models/Organization";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      // uncomment this and use data to filter in case we need to
      // const organizationData = req.query as Partial<OrganizationData>;
      return res.status(200).json({ organizations: await Organization.find() });
    }
    case "POST": {
      if (organizationValidator.safeParse(req.body).success) {
        return res.status(201).json({
          organization: await Organization.create(req.body as OrganizationData),
        });
      }
      return res
        .status(400)
        .json({ message: "Invalid organization data format" });
    }
  }
};
