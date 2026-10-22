export const getYesterday = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday;
};

const atlantaFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
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
