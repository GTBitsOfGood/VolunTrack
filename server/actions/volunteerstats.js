import { ObjectId } from "mongodb";

const AttendanceData = require("../mongodb/models/attendance");
import dbConnect from "../mongodb/index";

export async function getEventsByUserID(userId, next) {
  await dbConnect();
  return AttendanceData.find({ userId: userId })
    .then((events) => {
      const sortedEvents = events.sort(
        (a, b) => Number(b.timeCheckedIn) - Number(a.timeCheckedIn)
      );
      return sortedEvents;
    })
    .catch(next);
}
