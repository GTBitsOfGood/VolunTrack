import { Types } from "mongoose";
import { getShiftDateTimes } from "../../../../utils/dates";
import { NextApiRequest, NextApiResponse } from "next/types";
import { getServerSession } from "next-auth/next";
import dbConnect from "../../../../server/mongodb";
import Event from "../../../../server/mongodb/models/Event";
import EventParent from "../../../../server/mongodb/models/EventParent";
import VolunteerLog, {
  VolunteerLogDocument,
} from "../../../../server/mongodb/models/VolunteerLog";
import { authOptions } from "../auth/[...nextauth]";
import { isAdmin } from "../../../utils/routeProtection";

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

      // List all timesheets for org (admin only): only logs with inTime and outTime
      if (!userId && !eventId) {
        const admin = await isAdmin(req, res);
        if (!admin) {
          return res.status(403).json({ error: "Admin access required" });
        }
        const session = await getServerSession(req, res, authOptions);
        const organizationId = session?.user.organizationId;
        if (!organizationId) {
          return res
            .status(400)
            .json({ error: "Organization not found for user" });
        }
        const orgObjectId = new Types.ObjectId(
          typeof organizationId === "string"
            ? organizationId
            : String(organizationId)
        );
        const eventParents = await EventParent.find({
          organizationId: orgObjectId,
        }).select("_id");
        const eventParentIds = eventParents.map((ep) => ep._id);
        const events = await Event.find({
          eventParent: { $in: eventParentIds },
        }).select("_id");
        const eventIds = events.map((e) => e._id);
        const logs: VolunteerLogDocument[] = await VolunteerLog.find({
          eventId: { $in: eventIds },
          inTime: { $exists: true, $ne: null },
          outTime: { $exists: true, $ne: null },
        })
          .populate("userId", "firstName lastName")
          .populate({
            path: "eventId",
            populate: { path: "eventParent", select: "title tasks" },
          })
          .sort({ inTime: -1 })
          .lean();
        return res.status(200).json({ logs });
      }

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

      if (!Types.ObjectId.isValid(eventId) || !Types.ObjectId.isValid(userId)) {
        return res
          .status(400)
          .json({ error: "Valid userId and eventId are required" });
      }
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ error: "Event not found" });

      let parsedInTime: Date;
      let parsedOutTime: Date;
      try {
        const times = getShiftDateTimes(event.date, inTime, outTime);
        parsedInTime = times.start;
        parsedOutTime = times.end;
      } catch (error) {
        if (!(error instanceof RangeError)) throw error;
        return res.status(400).json({
          error:
            "Enter valid Atlanta start and end times on the event date, with end after start. Times must not be ambiguous or nonexistent due to daylight saving changes.",
        });
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
    case "DELETE": {
      const admin = await isAdmin(req, res);
      if (!admin) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const logId = req.query.logId;
      if (typeof logId !== "string" || !Types.ObjectId.isValid(logId)) {
        return res.status(400).json({ error: "Valid logId is required" });
      }

      const deletedLog = await VolunteerLog.findByIdAndDelete(logId);
      if (!deletedLog) {
        return res.status(404).json({ error: "Volunteer log not found" });
      }

      return res.status(200).json({ success: true });
    }
    default: {
      return res.status(405).json({ error: "Method not allowed" });
    }
  }
}
