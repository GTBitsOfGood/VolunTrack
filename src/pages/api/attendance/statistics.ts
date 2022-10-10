import dbConnect from "../../../../server/mongodb";
const Attendance = require("../../../../server/mongodb/models/attendance");
const { getUserFromId } = require("../../../../server/actions/users")

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "POST") {
    const eventId = req.body.eventId;

    const attendance = await Attendance.find({
      eventId,
    });

    if (!attendance) {
      return res.status(400);
    }
    console.log(attendance);
    let attendanceStats = [];
    for (let document of attendance) {
        const response = await getUserFromId(document.userId);
        let hours = -1;
        if (document.timeCheckedOut != null) {
            hours = Math.abs(document.timeCheckedOut - document.timeCheckedIn) / 36e5
        }
        const newDoc = {
            userId: document.userId,
            eventId: document.eventId,
            name: response.message.user.bio.first_name + " " + response.message.user.bio.last_name,
            email: response.message.user.bio.email,
            hours: hours,
        }
        attendanceStats.push(newDoc);
    }
    console.log(attendanceStats)
    return res.status(200).json(attendanceStats);
  }
}