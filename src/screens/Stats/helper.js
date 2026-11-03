import { attendanceWallTime } from "./User/hourParsing";

// Date-only bounds include the whole day; datetime bounds include that minute.
export const filterAttendance = (allAttendance, start, end) => {
  const normalize = (value) =>
    value && value !== "undefined"
      ? value instanceof Date
        ? attendanceWallTime(value)
        : value
      : "";
  const from = normalize(start);
  const to = normalize(end);
  return allAttendance.filter((attendance) => {
    const checkin = attendanceWallTime(attendance.checkinTime);
    const checkout = attendanceWallTime(attendance.checkoutTime);
    return (
      (!from || (checkin && checkin.slice(0, from.length) >= from)) &&
      (!to || (checkout && checkout.slice(0, to.length) <= to))
    );
  });
};
