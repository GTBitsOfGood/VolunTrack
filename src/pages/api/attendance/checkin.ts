import { ObjectId } from "mongodb";
import dbConnect from "../../../../server/mongodb";
const Attendance = require("../../../../server/mongodb/models/attendance");
const Event = require("../../../../server/mongodb/models/event");

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "POST") {
    const userId = req.body.userId;
    const eventId = req.body.eventId;

    const attendance = new Attendance({
      userId,
      eventId,
      timeCheckedIn: Date.now(),
    });
    const newAttendance = await attendance.save();

    const event = await Event.findById(eventId);
    const newEvent = await Event.findByIdAndUpdate(eventId, {
      checkedOutVolunteers: event.checkedOutVolunteers.filter(
        (id) => id.toString() !== userId
      ),
      checkedInVolunteers: event.checkedInVolunteers.concat(
        new ObjectId(userId)
      ),
    });
    console.log(newEvent);

    return res.status(200).json({ newAttendance, newEvent });
  }
}
