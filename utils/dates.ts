export const getYesterday = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday;
};

export const ATLANTA_TIME_ZONE = "America/New_York";

// Invalid or reversed punches never earn time.
export const minutesBetween = (
  start: Date | string | null | undefined,
  end: Date | string | null | undefined
): number => {
  if (!start || !end) return 0;
  const elapsed = new Date(end).getTime() - new Date(start).getTime();
  return Number.isFinite(elapsed) && elapsed >= 0
    ? Math.round(elapsed / 60000)
    : 0;
};

const atlantaFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: ATLANTA_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

// Represent Atlanta's wall-clock fields as UTC solely to compare calendar fields.
const atlantaWallTime = (timestamp: number): number => {
  const parts = atlantaFormatter.formatToParts(new Date(timestamp));
  const field = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(parts.find((part) => part.type === type)?.value);
  return Date.UTC(
    field("year"),
    field("month") - 1,
    field("day"),
    field("hour"),
    field("minute"),
    field("second")
  );
};

// Reject both DST gaps and repeated times: neither identifies a unique instant.
export const atlantaDateTimeToInstant = (date: string, time: string): Date => {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
  ) {
    throw new RangeError("Expected an Atlanta YYYY-MM-DD date and HH:mm time.");
  }
  const calendarDay = new Date(`${date}T00:00:00.000Z`);
  if (
    !Number.isFinite(calendarDay.getTime()) ||
    !calendarDay.toISOString().startsWith(date)
  ) {
    throw new RangeError("Invalid Atlanta calendar date.");
  }
  const wallTime = Date.parse(`${date}T${time}:00.000Z`);
  const day = 24 * 60 * 60 * 1000;
  // Probe both sides of a possible DST transition instead of assuming EST/EDT.
  const offsets = new Set(
    [-day, 0, day].map((delta) => {
      const probe = wallTime + delta;
      return atlantaWallTime(probe) - probe;
    })
  );
  const matches = [...offsets]
    .map((offset) => wallTime - offset)
    .filter((candidate) => atlantaWallTime(candidate) === wallTime);
  if (matches.length !== 1) {
    throw new RangeError(
      `Shift time ${date} ${time} is nonexistent or ambiguous in Atlanta.`
    );
  }
  return new Date(matches[0]);
};

// Resolve a stored shift calendar date and HH:mm times in America/New_York
export const getShiftDateTimes = (
  date: Date | string,
  startTime: string,
  endTime: string
): { start: Date; end: Date } => {
  const dateString = date instanceof Date ? date.toISOString() : date;
  if (
    !/^\d{4}-\d{2}-\d{2}(?:T.*Z)?$/.test(dateString) ||
    !Number.isFinite(Date.parse(dateString))
  ) {
    throw new RangeError("Invalid shift date.");
  }
  const calendarDate = dateString.slice(0, 10);
  if (
    !new Date(`${calendarDate}T00:00:00.000Z`)
      .toISOString()
      .startsWith(calendarDate)
  ) {
    throw new RangeError("Invalid shift calendar date.");
  }
  const validTime = /^([01]\d|2[0-3]):[0-5]\d$/;
  if (
    !validTime.test(startTime) ||
    !validTime.test(endTime) ||
    startTime >= endTime
  ) {
    throw new RangeError("Shift times must be HH:mm with end after start.");
  }
  return {
    start: atlantaDateTimeToInstant(calendarDate, startTime),
    end: atlantaDateTimeToInstant(calendarDate, endTime),
  };
};

// Format a real punch for Atlanta date/time inputs without using browser timezone.
export const instantToAtlantaDateTime = (
  value: Date | string
): { day: string; time: string } => {
  const instant = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(instant.getTime()))
    throw new RangeError("Invalid recorded punch.");
  const parts = atlantaFormatter.formatToParts(instant);
  const field = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const seconds = field("second");
  return {
    day: `${field("year")}-${field("month")}-${field("day")}`,
    time: `${field("hour")}:${field("minute")}${
      seconds === "00" ? "" : `:${seconds}`
    }`,
  };
};

// Display helpers: show a saved (universal-clock) timestamp as Atlanta wall-clock text.
const atlantaDisplayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: ATLANTA_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZoneName: "short",
});

const atlantaParts = (value: Date | string | null | undefined) => {
  if (value == null) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  const parts = atlantaDisplayFormatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? "";
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    dayPeriod: get("dayPeriod"),
    zone: get("timeZoneName"),
  };
};

export const formatAtlantaDate = (
  value: Date | string | null | undefined
): string => {
  const p = atlantaParts(value);
  return p ? `${p.year}-${p.month}-${p.day}` : "N/A";
};

export const formatAtlantaTime = (
  value: Date | string | null | undefined
): string => {
  const p = atlantaParts(value);
  return p ? `${p.hour}:${p.minute} ${p.dayPeriod} ${p.zone}` : "N/A";
};

export const getAtlantaMonthIndex = (
  value: Date | string | null | undefined
): number => {
  const p = atlantaParts(value);
  return p ? Number(p.month) - 1 : -1;
};

// Minute-precision Atlanta wall-clock text for the member statistics filters.
export const attendanceWallTime = (
  value: Date | string | null | undefined
): string => {
  if (!value || !Number.isFinite(new Date(value).getTime())) return "";
  const { day, time } = instantToAtlantaDateTime(value);
  return `${day}T${time.slice(0, 5)}`;
};
