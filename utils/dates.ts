export const getYesterday = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday;
};

export const ATLANTA_TIME_ZONE = "America/New_York";

// Whole minutes from start to end: what a record saves at check-out.
export const minutesBetween = (
  start: Date | string,
  end: Date | string
): number => {
  const elapsed = new Date(end).getTime() - new Date(start).getTime();
  return Math.abs(Math.round(elapsed / (60 * 1000)));
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

const resolveAtlantaTime = (date: string, time: string): Date => {
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
    start: resolveAtlantaTime(calendarDate, startTime),
    end: resolveAtlantaTime(calendarDate, endTime),
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
  return p ? `${p.hour}:${p.minute} ${p.dayPeriod}` : "N/A";
};

export const getAtlantaMonthIndex = (
  value: Date | string | null | undefined
): number => {
  const p = atlantaParts(value);
  return p ? Number(p.month) - 1 : -1;
};
