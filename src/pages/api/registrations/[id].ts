import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Registration from "../../../../server/mongodb/models/Registration";

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
      await registration.deleteOne();
      return res.status(204).end();
    }
  }
};
