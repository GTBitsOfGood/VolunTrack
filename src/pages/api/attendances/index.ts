import { HydratedDocument, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
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
      const { userId, eventId, checkinTimeBounds, checkoutTimeBounds } =
        req.query as {
          userId?: Types.ObjectId;
          eventId?: Types.ObjectId;
          checkinTimeBounds?: { start?: Date; end?: Date };
          checkoutTimeBounds?: { start?: Date; end?: Date };
        };

      const attendances: HydratedDocument<AttendanceData>[] =
        await Attendance.find();
      if (userId)
        attendances.filter((attendance) => attendance.user === userId);
      if (eventId)
        attendances.filter((attendance) => attendance.event === eventId);
      if (checkinTimeBounds) {
        attendances.filter((attendance) => {
          if (!attendance.checkinTime) return false;
          if (checkinTimeBounds.start && checkinTimeBounds.end)
            return (
              attendance.checkinTime >= checkinTimeBounds.start &&
              attendance.checkinTime <= checkinTimeBounds.end
            );
          if (checkinTimeBounds.start)
            return attendance.checkinTime >= checkinTimeBounds.start;
          if (checkinTimeBounds.end)
            return attendance.checkinTime <= checkinTimeBounds.end;
        });
      }
      if (checkoutTimeBounds) {
        attendances.filter((attendance) => {
          if (!attendance.checkoutTime) return false;
          if (checkoutTimeBounds.start && checkoutTimeBounds.end)
            return (
              attendance.checkoutTime >= checkoutTimeBounds.start &&
              attendance.checkoutTime <= checkoutTimeBounds.end
            );
          if (checkoutTimeBounds.start)
            return attendance.checkoutTime >= checkoutTimeBounds.start;
          if (checkoutTimeBounds.end)
            return attendance.checkoutTime <= checkoutTimeBounds.end;
        });
      }

      return res.status(200).json({ attendances });
    }
    case "POST": {
      const attendanceData = req.body as AttendanceData;

      const attendance = await Attendance.create(attendanceData);
      return res.status(201).json({ attendanceId: attendance._id });
    }
  }
};
