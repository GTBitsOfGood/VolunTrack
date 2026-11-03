// Keep full instants and precision; round only when displaying hours.
export const getHours = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const duration = new Date(endTime).getTime() - new Date(startTime).getTime();
  return Number.isFinite(duration) && duration >= 0 ? duration / 3600000 : 0;
};

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
export const attendanceWallTime = (value) => {
  if (!value || !Number.isFinite(new Date(value).getTime())) return "";
  const parts = formatter.formatToParts(new Date(value));
  const field = (type) => parts.find((part) => part.type === type)?.value;
  return `${field("year")}-${field("month")}-${field("day")}T${field(
    "hour"
  )}:${field("minute")}`;
};
export const formatAttendanceDate = (value) =>
  attendanceWallTime(value).slice(0, 10) || "N/A";
export const formatAttendanceTime = (value) => {
  if (!attendanceWallTime(value)) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));
};

// Round once to the nearest whole minute, carrying 60 minutes into the hour.
export const formatHours = (hours) => {
  const minutes =
    Number.isFinite(hours) && hours > 0 ? Math.round(hours * 60) : 0;
  return `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
};
