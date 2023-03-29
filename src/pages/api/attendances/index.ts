import { HydratedDocument, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Attendance, {
  AttendanceData,
} from "../../../../server/mongodb/models/Attendance";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<
    | { attendances: HydratedDocument<AttendanceData>[] }
    | { attendanceId: Types.ObjectId }
  >
) => {
  switch (req.method) {
    case "GET": {
      const userId = req.query.userId as string;

      await dbConnect();
      const attendances = await Attendance.find({ user: userId });
      return res.status(200).json({ attendances });
    }
    case "POST": {
      const { eventId, userId } = req.body as {
        eventId: Types.ObjectId;
        userId: Types.ObjectId;
      };

      await dbConnect();
      const attendance = await Attendance.create({
        eventId,
        userId,
        timeCheckedIn: new Date(),
      });
      return res.status(201).json({ attendanceId: attendance._id });
    }
  }
};
