import { ObjectId } from "mongodb";
import dbConnect from "../../../../server/mongodb";
const Event = require("../../../../server/mongodb/models/event");
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

    const newAttendance = await attendance.updateOne({
      timeCheckedOut: Date.now(),
    });

    const event = await Event.findById(eventId);
    event.checkedInVolunteers = event.checkedInVolunteers.filter(
      (id) => id.toString() !== userId
    );
    event.checkedOutVolunteers = event.checkedOutVolunteers.concat(
      new ObjectId(userId)
    );
    const newEvent = await event.save();

    return res.status(200).json({ newAttendance, newEvent });
  }
}
