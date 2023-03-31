const AttendanceData = require("../mongodb/models/attendance");
import dbConnect from "../mongodb/";

export async function getAttendanceByUserID(userId, next) {
  await dbConnect();

  return AttendanceData.find({ userId: userId })
    .then((events) => {
      return events.sort(
        (a, b) => Number(b.checkinTime) - Number(a.checkinTime)
      );
    })
    .catch(next);
}
