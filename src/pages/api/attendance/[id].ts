import dbConnect from "../../../../server/mongodb";
const Attendance = require("../../../../server/mongodb/models/attendance");

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "PUT") {
    const attendanceId = req.query.id;

    const attendance = await Attendance.findOneAndReplace(
      { _id: attendanceId },
      new Attendance(req.body)
    );

    return res.status(200).json(attendance);
  }
  if (req.method === "DELETE") {
    const attendanceId = req.query.id;

    Attendance.findOneAndDelete({ _id: attendanceId });

    return res.status(200);
  }
}
