import { HydratedDocument, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Attendance, {
  AttendanceData,
} from "../../../../server/mongodb/models/Attendance";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<
    | { attendance?: HydratedDocument<AttendanceData> }
    | { attendanceId?: Types.ObjectId }
  >
) => {
  await dbConnect();

  const id = req.query.id as string;

  const attendance = await Attendance.findById(id);
  if (!attendance) {
    return res.status(404);
  }

  switch (req.method) {
    case "GET": {
      return res.status(200).json({ attendance });
    }
    case "PUT": {
      const attendanceData = req.body as Partial<AttendanceData>;

      await attendance.updateOne(attendanceData);
      return res.status(200).json({ attendanceId: attendance._id });
    }
    case "DELETE": {
      await attendance.deleteOne();
      return res.status(200).json({ attendanceId: attendance._id });
    }
  }
};
