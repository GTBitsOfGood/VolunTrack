// Saved minutes -> hours with one decimal (e.g. 3 -> 0.1). Missing/invalid -> 0.
export const minutesToHours = (minutes: number | null | undefined): number => {
  const value = Number(minutes);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.round(value / 6) / 10;
};