export const filterAttendance = (allAttendance, start, end) => {
  let result = [];
  if (start === "undefined" && end === "undefined") {
    return allAttendance;
  } else if (start === "undefined") {
    for (const attendance of allAttendance) {
      if (new Date(attendance.timeCheckedOut) <= end) {
        result.push(attendance);
      }
    }
  } else if (end === "undefined") {
    for (const attendance of allAttendance) {
      if (new Date(attendance.timeCheckedIn) >= start) {
        result.push(attendance);
      }
    }
  } else {
    for (const attendance of allAttendance) {
      if (
        new Date(attendance.timeCheckedIn) >= start &&
        new Date(attendance.timeCheckedOut) <= end
      ) {
        result.push(attendance);
      }
    }
  }
  return result;
};
