import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Attendance, {
  attendanceValidator,
} from "../../../../server/mongodb/models/Attendance";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const attendanceId = req.query.id as string;

  const attendance = await Attendance.findById(attendanceId);
  if (!attendance) {
    return res
      .status(404)
      .json({ message: `Attendance with id ${attendanceId} not found` });
  }

  switch (req.method) {
    case "GET": {
      return res.status(200).json({ attendance });
    }
    case "PUT": {
      if (attendanceValidator.partial().safeParse(req.body).success) {
        await attendance.updateOne();
        return res.status(200).json({ attendance });
      }

      return res
        .status(400)
        .json({ message: "Invalid attendance data format" });
    }
    case "DELETE": {
      await attendance.deleteOne();
      return res.status(204);
    }
  }
};
