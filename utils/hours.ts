import { minutesBetween } from "./dates";

type SavedShift = {
  checkinTime?: Date | string | null;
  checkoutTime?: Date | string | null;
  minutes?: number | null;
};

export const minutesToHours = (minutes: number | null | undefined): number =>
  typeof minutes === "number" && Number.isFinite(minutes) && minutes > 0
    ? minutes / 60
    : 0;

// Saved minutes are authoritative. Older records without minutes use punches.
const attendanceMinutes = (shift: SavedShift): number => {
  if (!shift.checkinTime || !shift.checkoutTime) return 0;
  const duration =
    new Date(shift.checkoutTime).getTime() -
    new Date(shift.checkinTime).getTime();
  if (!Number.isFinite(duration) || duration < 0) return 0;
  return shift.minutes == null
    ? minutesBetween(shift.checkinTime, shift.checkoutTime)
    : typeof shift.minutes === "number" &&
      Number.isFinite(shift.minutes) &&
      shift.minutes > 0
    ? shift.minutes
    : 0;
};

export const attendanceHours = (shift: SavedShift): number =>
  minutesToHours(attendanceMinutes(shift));

// Sum whole saved minutes before converting to avoid per-record rounding.
export const totalHours = (shifts: SavedShift[]): number =>
  shifts.reduce((sum, shift) => sum + attendanceMinutes(shift), 0) / 60;

export const formatDurationHours = (hours: number): string => {
  const minutes =
    Number.isFinite(hours) && hours > 0 ? Math.round(hours * 60) : 0;
  return `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
};
export const formatHours = (shift: SavedShift): string =>
  formatDurationHours(attendanceHours(shift));
