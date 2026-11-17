import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Attendance from "../../../../server/mongodb/models/Attendance";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { createHistoryEventAttendanceDeleted } from "../../../../server/actions/historyEvent";
import { isAdmin } from "../../../utils/routeProtection";

import { createAttendanceCorrectionHandler } from "../../../../server/actions/attendanceCorrections";
import { attendanceCorrectionDependencies } from "../../../../server/actions/attendanceCorrectionDependencies";

const updateAttendance = createAttendanceCorrectionHandler(
  "update",
  attendanceCorrectionDependencies
);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PUT") return updateAttendance(req, res);
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
  if (
    attendance.organizationId.toString() !== user.organizationId?.toString() ||
    (user.role !== "admin" &&
      attendance.userId.toString() !== user._id.toString())
  ) {
    return res.status(403).json({
      error: "Attendance does not belong to your organization and user.",
    });
  }

  switch (req.method) {
    case "GET": {
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
