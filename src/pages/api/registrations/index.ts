import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Registration from "../../../../server/mongodb/models/Registration";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<{ registrationId: Types.ObjectId }>
) => {
  await dbConnect();

  switch (req.method) {
    case "POST": {
      const { minors, eventId, userId } = req.body as {
        minors: string[];
        eventId: Types.ObjectId;
        userId: Types.ObjectId;
      };

      const registration = await Registration.create({
        minors,
        event: eventId,
        user: userId,
      });
      return res.status(201).json({ registrationId: registration._id });
    }
  }
};
