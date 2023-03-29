const AttendanceData = require("../mongodb/models/attendance");

export async function getAttendanceByUserID(userId, next) {
  return AttendanceData.find({ userId: userId })
    .then((events) => {
      return events.sort(
        (a, b) => Number(b.timeCheckedIn) - Number(a.timeCheckedIn)
      );
    })
    .catch(next);
}
