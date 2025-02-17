import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Attendance, {
  AttendanceDocument,
  AttendanceInputClient,
  attendanceInputServerValidator,
} from "../../../../server/mongodb/models/Attendance";

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
      const organizationId = req.query.organizationId
        ? new Types.ObjectId(req.query.organizationId as string)
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

      const match: Partial<AttendanceInputClient> = {};
      if (eventId) match.eventId = eventId;
      if (organizationId) match.organizationId = organizationId;
      if (userId) match.userId = userId;

      const attendances: AttendanceDocument[] = await Attendance.find(match);

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
      if (checkoutTimeStart === null && checkoutTimeEnd === null)
        attendances.filter((attendance) => attendance.checkoutTime === null);
      else {
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
      }

      return res.status(200).json({ attendances });
    }
    case "POST": {
      const result = attendanceInputServerValidator.safeParse(req.body);
      if (!result.success) return res.status(400).json({ error: result.error });

      return res
        .status(201)
        .json({ attendance: await Attendance.create(result.data) });
    }
  }
};
