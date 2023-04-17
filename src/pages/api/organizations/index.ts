import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Organization, {
  organizationInputServerValidator,
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
      const result = organizationInputServerValidator.safeParse(req.body);
      if (!result.success) return res.status(400).json(result);

      return res.status(201).json({
        organization: await Organization.create(result.data),
      });
    }
  }
};
