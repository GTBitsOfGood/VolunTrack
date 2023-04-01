import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Organization, {
  OrganizationData,
  organizationValidator,
} from "../../../../server/mongodb/models/Organization";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const organizationId = req.query.id as string;
  const organization = await Organization.findById(organizationId);
  if (!organization)
    return res
      .status(404)
      .json({ message: `Organization with id ${organizationId} not found` });

  switch (req.method) {
    case "GET": {
      return res.status(200).json({ organization });
    }
    case "PUT": {
      if (organizationValidator.partial().safeParse(req.body).success) {
        await organization.updateOne(req.body as Partial<OrganizationData>);
        return res.status(200).json({ organization });
      }
      return res
        .status(400)
        .json({ message: "Invalid organization data format" });
    }
    case "DELETE": {
      await organization.deleteOne();
      return res.status(200);
    }
  }
};
