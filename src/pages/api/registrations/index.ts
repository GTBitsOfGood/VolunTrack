import { isValidObjectId, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Registration, {
  RegistrationInputClient,
  registrationInputServerValidator,
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
      const organizationId = req.query.organizationId
        ? new Types.ObjectId(req.query.organizationId as string)
        : undefined;

      const match: Partial<RegistrationInputClient> = {};
      if (eventId) match.eventId = eventId;
      if (userId) match.userId = userId;
      if (organizationId) match.organizationId = organizationId;

      return res.status(200).json({
        registrations: await Registration.find(match),
      });
    }
    case "POST": {
      const result = registrationInputServerValidator.safeParse(req.body);
      if (!result.success) return res.status(400).json({ error: result.error });

      await sendRegistrationConfirmationEmail(
        result.data.userId,
        result.data.eventId
      );
      return res.status(201).json({
        registration: await Registration.create(result.data),
      });
    }
    case "DELETE": {
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

      const match: Partial<RegistrationInputClient> = {};
      if (eventId) match.eventId = eventId;
      else return res.status(500);
      if (userId) match.userId = userId;
      else return res.status(500);

      return res.status(200).json({
        registration: await Registration.findOneAndDelete(match),
      });
    }
  }
};
