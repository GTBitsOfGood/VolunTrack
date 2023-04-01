import { isValidObjectId, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Registration, {
  RegistrationData,
  registrationValidator,
} from "../../../../server/mongodb/models/Registration";
import { sendRegistrationConfirmationEmail } from "../../../utils/mailersend-email.js";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      if (req.query.eventId && !isValidObjectId(req.query.eventId))
        return res.status(400).json({
          message: `Invalid event id: ${req.query.eventId as string}`,
        });
      if (req.query.userId && !isValidObjectId(req.query.userId))
        return res
          .status(400)
          .json({ message: `Invalid user id: ${req.query.userId as string}` });

      const eventId = req.query.eventId
        ? new Types.ObjectId(req.query.eventId as string)
        : undefined;
      const userId = req.query.userId
        ? new Types.ObjectId(req.query.userId as string)
        : undefined;

      const match: Partial<RegistrationData> = {};
      if (eventId) match.eventId = eventId;
      if (userId) match.userId = userId;

      return res.status(200).json({
        registrations: await Registration.find(match),
      });
    }
    case "POST": {
      const registrationData = req.body as {
        userId: string;
        eventId: string;
        minors?: string[];
      };
      const userId = new Types.ObjectId(registrationData.userId);
      const eventId = new Types.ObjectId(registrationData.eventId);

      if (
        registrationValidator.safeParse({
          userId,
          eventId,
          minors: registrationData.minors,
        }).success
      ) {
        await sendRegistrationConfirmationEmail(userId, eventId);
        return res
          .status(201)
          .json({ registration: await Registration.create(registrationData) });
      }
      return res
        .status(400)
        .json({ message: "Invalid registration data format" });
    }
  }
};
