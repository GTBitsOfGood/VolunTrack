import dbConnect from "../../../../server/mongodb";
const Attendance = require("../../../../server/mongodb/models/attendance");

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "POST") {
    const newAttendance = await Attendance.create({
      ...req.body,
      timeCheckedIn: Date.now(),
    });
    return res.status(200).json(newAttendance);
  }
}
