import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import VolunteerLog, {
  VolunteerLogDocument,
} from "../../../../server/mongodb/models/VolunteerLog";

type VolunteerLogPostBody = {
  userId?: string;
  eventId?: string;
  inTime?: string;
  outTime?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      const userId = req.query.userId
        ? new Types.ObjectId(req.query.userId as string)
        : undefined;
      const eventId = req.query.eventId
        ? new Types.ObjectId(req.query.eventId as string)
        : undefined;

      if (!userId || !eventId) {
        return res
          .status(400)
          .json({ error: "userId and eventId are required query params" });
      }

      const logs: VolunteerLogDocument[] = await VolunteerLog.find({
        userId,
        eventId,
      }).sort({ inTime: 1 });

      return res.status(200).json({ logs });
    }
    case "POST": {
      const bodyUnknown: unknown = req.body;

      if (!bodyUnknown || typeof bodyUnknown !== "object") {
        return res.status(400).json({
          error: "userId, eventId, inTime, and outTime are required fields",
        });
      }

      const { userId, eventId, inTime, outTime } =
        bodyUnknown as VolunteerLogPostBody;

      if (
        typeof userId !== "string" ||
        typeof eventId !== "string" ||
        typeof inTime !== "string" ||
        typeof outTime !== "string"
      ) {
        return res.status(400).json({
          error: "userId, eventId, inTime, and outTime are required fields",
        });
      }

      const parseTimeOrDateTime = (value: unknown) => {
        if (typeof value !== "string") return new Date(NaN);

        // Support time-only strings from <input type="time">, e.g. "10:00"
        if (/^\d{2}:\d{2}$/.test(value)) {
          const [hoursStr, minutesStr] = value.split(":");
          const hours = Number(hoursStr);
          const minutes = Number(minutesStr);
          const now = new Date();
          return new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hours,
            minutes
          );
        }

        return new Date(value);
      };

      const parsedInTime = parseTimeOrDateTime(inTime);
      const parsedOutTime = parseTimeOrDateTime(outTime);

      if (Number.isNaN(parsedInTime.getTime())) {
        return res.status(400).json({ error: "Invalid inTime value" });
      }
      if (Number.isNaN(parsedOutTime.getTime())) {
        return res.status(400).json({ error: "Invalid outTime value" });
      }
      if (parsedOutTime <= parsedInTime) {
        return res.status(400).json({ error: "outTime must be after inTime" });
      }

      // Ensure users cannot update an existing log; only one log per user/event.
      const existingLog = await VolunteerLog.findOne({
        userId: new Types.ObjectId(userId),
        eventId: new Types.ObjectId(eventId),
      });
      if (existingLog) {
        return res.status(400).json({
          error: "Log for this user and event already exists",
        });
      }

      const log = await VolunteerLog.create({
        userId: new Types.ObjectId(userId),
        eventId: new Types.ObjectId(eventId),
        inTime: parsedInTime,
        outTime: parsedOutTime,
      });

      return res.status(201).json({ log });
    }
    default: {
      return res.status(405).json({ error: "Method not allowed" });
    }
  }
}
