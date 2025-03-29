import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Registration from "../../../../server/mongodb/models/Registration";
import { isAdmin } from "../../../utils/routeProtection";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const registrationId = req.query.id as string;
  const registration = await Registration.findById(registrationId);
  if (!registration)
    return res.status(404).json({
      error: `Registration with id ${registrationId} not found`,
    });

  switch (req.method) {
    case "DELETE": {
      const isadmin = await isAdmin(req, res);
      if (!isadmin) {
        return res
          .status(403)
          .json({ error: "Only Admins can delete registrations" });
      }

      await registration.deleteOne();
      return res.status(204).end();
    }
  }
};
