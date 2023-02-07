import dbConnect from "../mongodb/index";
const AttendanceData = require("../mongodb/models/attendance");

export async function getAttendanceByUserID(userId, next) {
  await dbConnect();
  return AttendanceData.find({ userId: userId })
    .then((events) => {
      return events.sort(
        (a, b) => Number(b.timeCheckedIn) - Number(a.timeCheckedIn)
      );
    })
    .catch(next);
}

export async function getAllAttendanceObjects(next) {
  await dbConnect();
  return AttendanceData.find()
    .then((events) => {
      return events.sort(
        (a, b) => Number(b.timeCheckedIn) - Number(a.timeCheckedIn)
      );
    })
    .catch(next);
}
