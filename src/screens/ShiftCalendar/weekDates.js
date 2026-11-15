// Date helpers shared by the Shift Calendar page and the Events page box.
// Days are "YYYY-MM-DD" strings in UTC, matching how Event.date is stored.
export const DAY_MS = 24 * 60 * 60 * 1000;

export const toDay = (ms) => new Date(ms).toISOString().slice(0, 10);
export const fromDay = (day) => new Date(`${day}T00:00:00.000Z`).getTime();
export const addWeeks = (day, weeks) =>
  toDay(fromDay(day) + weeks * 7 * DAY_MS);

// "Today" in Atlanta, so an admin at 9 PM isn't moved to tomorrow's week
export const atlantaToday = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(
    new Date()
  );

// The calendar day of a Date picked on the month calendar (local midnight)
export const localDay = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;

export const sundayOnOrBefore = (day) => {
  const ms = fromDay(day);
  return toDay(ms - new Date(ms).getUTCDay() * DAY_MS);
};

// "Wednesday, Nov 18"
export const formatDay = (day) =>
  new Date(`${day}T00:00:00.000Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

// "Wed, Nov 18"
export const shortDay = (day) =>
  new Date(`${day}T00:00:00.000Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

// "09:00" -> "9:00am"
export const formatTime = (time) => {
  const [hour, min] = time.split(":");
  const hours = parseInt(hour, 10);
  return `${((hours + 11) % 12) + 1}:${min}${hours > 11 ? "pm" : "am"}`;
};
