import { HydratedDocument, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Attendance, {
  AttendanceData,
} from "../../../../server/mongodb/models/Attendance";
import { attendanceInputValidator } from "../../../validators/attendances";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      const userId = req.query.userId
        ? new Types.ObjectId(req.query.userId as string)
        : undefined;
      const eventId = req.query.eventId
        ? new Types.ObjectId(req.query.eventId as string)
        : undefined;
      const checkinTimeStart = req.query.checkinTimeStart
        ? new Date(req.query.checkinTimeStart as string)
        : undefined;
      const checkinTimeEnd = req.query.checkinTimeEnd
        ? new Date(req.query.checkinTimeEnd as string)
        : undefined;
      const checkoutTimeStart = req.query.checkoutTimeStart
        ? new Date(req.query.checkoutTimeStart as string)
        : undefined;
      const checkoutTimeEnd = req.query.checkoutTimeEnd
        ? new Date(req.query.checkoutTimeEnd as string)
        : undefined;

      const attendances: HydratedDocument<AttendanceData>[] =
        await Attendance.find();
      if (userId)
        attendances.filter((attendance) => attendance.userId === userId);
      if (eventId)
        attendances.filter((attendance) => attendance.eventId === eventId);
      if (checkinTimeStart)
        attendances.filter(
          (attendance) =>
            attendance.checkinTime && attendance.checkinTime >= checkinTimeStart
        );
      if (checkinTimeEnd)
        attendances.filter(
          (attendance) =>
            attendance.checkinTime && attendance.checkinTime <= checkinTimeEnd
        );
      if (checkoutTimeStart)
        attendances.filter(
          (attendance) =>
            attendance.checkoutTime &&
            attendance.checkoutTime >= checkoutTimeStart
        );
      if (checkoutTimeEnd)
        attendances.filter(
          (attendance) =>
            attendance.checkoutTime &&
            attendance.checkoutTime <= checkoutTimeEnd
        );

      return res.status(200).json({ success: true, attendances });
    }
    case "POST": {
      if (attendanceInputValidator.safeParse(req.body).success)
        return res.status(201).json({
          success: true,
          attendance: await Attendance.create(req.body),
        });

      return res
        .status(400)
        .json({ success: false, error: "Invalid attendance data format" });
    }
  }
};
