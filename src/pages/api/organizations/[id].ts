import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Organization, {
  organizationInputServerValidator,
} from "../../../../server/mongodb/models/Organization";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const organizationId = req.query.id as string;
  const organization = await Organization.findById(organizationId);
  if (!organization)
    return res.status(404).json({
      error: `Organization with id ${organizationId} not found`,
    });

  switch (req.method) {
    case "GET": {
      return res.status(200).json({ organization });
    }
    case "PUT": {
      const result = organizationInputServerValidator
        .partial()
        .safeParse(req.body);
      if (!result.success) return res.status(400).json(result);

      await organization.updateOne(result.data);
      return res.status(200).json({ organization });
    }
    case "DELETE": {
      await organization.deleteOne();
      return res.status(204).end();
    }
  }
};
