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
    console.log(event.checkedOutVolunteers[0]);
    event.checkedOutVolunteers = event.checkedOutVolunteers.filter(
      (id) => id.toString() !== userId
    );
    event.checkedInVolunteers = event.checkedInVolunteers.concat(
      new ObjectId(userId)
    );
    const newEvent = await event.save();

    return res.status(200).json({ newAttendance, newEvent });
  }
}
