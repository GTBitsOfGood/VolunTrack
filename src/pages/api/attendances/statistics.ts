import { QuerySelector, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Attendance, {
  AttendanceInputClient,
} from "../../../../server/mongodb/models/Attendance";
import Event from "../../../../server/mongodb/models/Event";
import { isAdmin } from "../../../utils/routeProtection";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      const isadmin = await isAdmin(req, res);
      if (!isadmin) {
        return res
          .status(403)
          .json({ error: "Only Admins can view attendance statistics" });
      }
      const organizationId = req.query.organizationId
        ? new Types.ObjectId(req.query.organizationId as string)
        : undefined;
      const startDate = req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined;
      const endDate = req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined;

      const match: Partial<
        Omit<AttendanceInputClient, "checkinTime" | "checkoutTime"> & {
          checkinTime: QuerySelector<Date>;
          checkoutTime: QuerySelector<Date>;
        }
      > = {};
      if (organizationId) match.organizationId = organizationId;
      if (startDate) match.checkinTime = { $gte: startDate };
      if (endDate) match.checkoutTime = { $lt: endDate };

      const statistics = await Attendance.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$eventId",
            num: { $count: {} },
            users: { $addToSet: "$userId" },
            attendanceId: { $addToSet: "$_id" },
            minutes: { $sum: "$minutes" },
          },
        },
      ]);

      // $sum: {
      //   $dateDiff: {
      //     startDate: "$checkinTime",
      //     endDate: "$checkoutTime",
      //     unit: "minute",
      //   },
      // },

      // withEvents=1 adds each shift's name, date and times, so the Events
      // summary page no longer downloads every shift to look them up.
      if (req.query.withEvents === "1") {
        const shiftIds = (statistics as { _id: Types.ObjectId | null }[])
          .map((stat) => stat._id)
          .filter((id): id is Types.ObjectId => !!id);
        const shifts = shiftIds.length
          ? await Event.find(
              { _id: { $in: shiftIds } },
              { date: 1, eventParent: 1 }
            )
              .populate("eventParent", "title startTime endTime")
              .lean()
          : [];
        const events: Record<
          string,
          { title: string; date: Date; startTime: string; endTime: string }
        > = {};
        for (const shift of shifts) {
          const parent = shift.eventParent as unknown as {
            title?: string;
            startTime?: string;
            endTime?: string;
          } | null;
          if (!parent) continue;
          events[String(shift._id)] = {
            title: parent.title ?? "",
            date: shift.date,
            startTime: parent.startTime ?? "",
            endTime: parent.endTime ?? "",
          };
        }
        return res.status(200).json({ statistics, events });
      }

      return res.status(200).json({ statistics });
    }
  }
};
