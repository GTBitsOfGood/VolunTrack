import { isValidObjectId, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Registration, {
  RegistrationData,
} from "../../../../server/mongodb/models/Registration";
import { sendRegistrationConfirmationEmail } from "../../../utils/mailersend-email.js";
import { registrationInputValidator } from "../../../validators/registrations";

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
      const result = registrationInputValidator.safeParse(req.body);
      if (!result.success) return res.status(400).json(result);

      await sendRegistrationConfirmationEmail(
        result.data.userId,
        result.data.eventId
      );
      return res.status(201).json({
        success: true,
        registration: await Registration.create(result.data),
      });
    }
  }
};
