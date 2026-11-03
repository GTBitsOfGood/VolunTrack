// Saved minutes -> hours with one decimal (e.g. 3 -> 0.1). Missing/invalid -> 0.
// Dividing by 6 turns minutes into tenths of an hour.
export const minutesToHours = (minutes: number | null | undefined): number => {
  const value = Number(minutes);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.round(value / 6) / 10;
};

type SavedShift = {
  checkoutTime?: string | Date | null;
  minutes?: number | null;
};

// One shift's hours. A shift with no clock-out counts as 0.
export const attendanceHours = (shift: SavedShift): number =>
  shift.checkoutTime ? minutesToHours(shift.minutes) : 0;

// All shifts added up, kept to one decimal.
export const totalHours = (shifts: SavedShift[]): number => {
  const sum = shifts.reduce((acc, shift) => acc + attendanceHours(shift), 0);
  return Math.round(sum * 10) / 10;
};

// What the tables show, like "2.5 hour(s)".
export const formatHours = (shift: SavedShift): string =>
  `${attendanceHours(shift)} hour(s)`;
