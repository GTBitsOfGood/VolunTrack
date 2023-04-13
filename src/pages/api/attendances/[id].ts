import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Attendance, {
  attendanceInputServerValidator,
} from "../../../../server/mongodb/models/Attendance";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const attendanceId = req.query.id as string;

  const attendance = await Attendance.findById(attendanceId);
  if (!attendance) {
    return res.status(404).json({
      error: `Attendance with id ${attendanceId} not found`,
    });
  }

  switch (req.method) {
    case "GET": {
      return res.status(200).json({ attendance });
    }
    case "PUT": {
      const result = attendanceInputServerValidator
        .partial()
        .safeParse(req.body);
      if (!result.success) return res.status(400).json({ error: result.error });


      await attendance.updateOne({ $set: { checkoutTime: result.data.checkoutTime } });
      return res.status(200).json({ attendance });
    }
    case "DELETE": {
      await attendance.deleteOne();
      return res.status(204);
    }
  }
};
