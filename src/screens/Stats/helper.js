export const filterAttendance = (allAttendance, start, end) => {
  let result = [];
  if (start === "undefined" && end === "undefined") {
    return allAttendance;
  } else if (start === "undefined") {
    for (const attendance of allAttendance) {
      if (new Date(attendance.checkoutTime) <= end) {
        result.push(attendance);
      }
    }
  } else if (end === "undefined") {
    for (const attendance of allAttendance) {
      if (new Date(attendance.checkinTime) >= start) {
        result.push(attendance);
      }
    }
  } else {
    for (const attendance of allAttendance) {
      if (
        new Date(attendance.checkinTime) >= start &&
        new Date(attendance.checkoutTime) <= end
      ) {
        result.push(attendance);
      }
    }
  }
  return result;
};
