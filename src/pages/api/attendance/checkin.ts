import dbConnect from "../../../../server/mongodb";
const Attendance = require("../../../../server/mongodb/models/attendance");

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "POST") {
    const userId = req.body.userId;
    const eventId = req.body.eventId;

    const newAttendance = new Attendance({
      userId,
      eventId,
      timeCheckedIn: Date.now(),
    });

    const attendance = await newAttendance.save();
    return res.status(200).json(attendance);
  }
}
