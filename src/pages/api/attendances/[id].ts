import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Attendance, {
  attendanceInputServerValidator,
} from "../../../../server/mongodb/models/Attendance";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import {
  createHistoryEventAttendanceEdited,
  createHistoryEventAttendanceDeleted,
} from "../../../../server/actions/historyEvent";
import { isAdmin } from "../../../utils/routeProtection";
import { minutesBetween } from "../../../../utils/dates";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const attendanceId = req.query.id as string;

  const attendance = await Attendance.findById(attendanceId);
  if (!attendance) {
    return res.status(404).json({
      error: `Attendance with id ${attendanceId} not found`,
    });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user)
    return res.status(400).json({ error: "User session not found" });
  const user = session.user;

  switch (req.method) {
    case "GET": {
      return res.status(200).json({ attendance });
    }
    case "PUT": {
      const isadmin = await isAdmin(req, res);
      if (!isadmin) {
        return res
          .status(403)
          .json({ error: "Only Admins can modify organization settings" });
      }
      const result = attendanceInputServerValidator
        .partial()
        .safeParse(req.body);
      if (!result.success) return res.status(400).json({ error: result.error });

      let checkIn = attendance.checkinTime;
      if (result.data.checkinTime) {
        // @ts-expect-error
        checkIn = result.data.checkinTime;
      }

      // @ts-expect-error checkoutTime can be left out of an edit, and checkIn can be null
      const minutes = minutesBetween(checkIn, result.data.checkoutTime);

      await createHistoryEventAttendanceEdited(user, attendance);
      await attendance.updateOne({
        $set: {
          checkoutTime: result.data.checkoutTime,
          checkinTime: result.data.checkinTime,
          minutes,
        },
        upsert: true,
        returnDocument: "after",
      });
      return res.status(200).json({ attendance });
    }
    case "DELETE": {
      const isadmin = await isAdmin(req, res);
      if (!isadmin) {
        return res
          .status(403)
          .json({ error: "Only Admins can modify organization settings" });
      }
      await createHistoryEventAttendanceDeleted(user, attendance);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const deleted = await attendance.deleteOne();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return res.status(204).json({ deleted });
    }
  }
};
