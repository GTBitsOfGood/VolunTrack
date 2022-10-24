import dbConnect from "../../../../server/mongodb";
const Attendance = require("../../../../server/mongodb/models/attendance");

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "POST") {
    const userId = req.body.userId;
    const eventId = req.body.eventId;

    const attendance = await Attendance.findOne({
      userId,
      eventId,
      timeCheckedOut: null,
    });

    if (!attendance) {
      return res.status(400);
    }

    await attendance.updateOne({ timeCheckedOut: Date.now() });
    console.log(attendance);

    return res.status(200).json(attendance);
  }
}
