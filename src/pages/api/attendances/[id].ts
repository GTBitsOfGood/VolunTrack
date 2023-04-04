import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Attendance from "../../../../server/mongodb/models/Attendance";
import { attendanceInputValidator } from "../../../validators/attendances";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const attendanceId = req.query.id as string;

  const attendance = await Attendance.findById(attendanceId);
  if (!attendance) {
    return res.status(404).json({
      success: false,
      error: `Attendance with id ${attendanceId} not found`,
    });
  }

  switch (req.method) {
    case "GET": {
      return res.status(200).json({ success: true, attendance });
    }
    case "PUT": {
      if (attendanceInputValidator.partial().safeParse(req.body).success) {
        await attendance.updateOne();
        return res.status(200).json({ success: true, attendance });
      }
      return res
        .status(400)
        .json({ success: false, error: "Invalid attendance data format" });
    }
    case "DELETE": {
      await attendance.deleteOne();
      return res.status(204).json({ success: true });
    }
  }
};
