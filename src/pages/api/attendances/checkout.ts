const Attendance = require("../../../../server/mongodb/models/attendance");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const userId = req.body.userId;
    const eventId = req.body.eventId;

    const attendance = await Attendance.findOne({
      userId,
      eventId,
      checkoutTime: null,
    });

    if (!attendance) {
      return res.status(400);
    }

    const newAttendance = await attendance.updateOne({
      checkoutTime: Date.now(),
    });

    return res.status(200).json(newAttendance);
  }
}
