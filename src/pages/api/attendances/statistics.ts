import { QuerySelector, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Attendance, {
  AttendanceInputClient,
} from "../../../../server/mongodb/models/Attendance";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      const eventId = req.query.eventId
        ? new Types.ObjectId(req.query.eventId as string)
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
      if (eventId) match.eventId = eventId;
      if (startDate) match.checkinTime = { $gte: startDate };
      if (endDate) match.checkoutTime = { $lt: endDate };

      const statistics = await Attendance.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$eventId",
            num: { $count: {} },
            users: { $addToSet: "$userId" },
            minutes: {
              $sum: {
                $dateDiff: {
                  startDate: "$checkinTime",
                  endDate: "$checkoutTime",
                  unit: "minute",
                },
              },
            },
          },
        },
      ]);

      return res.status(200).json({ statistics });
    }
  }
};
