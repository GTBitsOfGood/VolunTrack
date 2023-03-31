import { QuerySelector, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Attendance, {
  AttendanceData,
} from "../../../../server/mongodb/models/Attendance";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<{
    statistics: { num: number; users: Types.ObjectId[]; minutes: number }[];
  }>
) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      const { eventIdString, startDateString, endDateString } = req.query as {
        [queryParam: string]: string;
      };

      const eventId = eventIdString
        ? new Types.ObjectId(eventIdString)
        : undefined;
      const startDate = startDateString ? new Date(startDateString) : undefined;
      const endDate = endDateString ? new Date(endDateString) : undefined;

      const match: Partial<
        Omit<AttendanceData, "checkinTime" | "checkoutTime"> & {
          checkinTime: QuerySelector<Date>;
          checkoutTime: QuerySelector<Date>;
        }
      > = {};
      if (eventId) match.event = eventId;
      if (startDate) match.checkinTime = { $gte: startDate };
      if (endDate) match.checkoutTime = { $lt: endDate };

      const statistics = await Attendance.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$event",
            num: { $count: {} },
            users: { $addToSet: "$user" },
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
