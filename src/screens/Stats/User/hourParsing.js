export const getHours = (startTime, endTime) => {
  if (startTime == null || endTime == null) return 0;

  // Preserve the date and timezone so crossing UTC midnight keeps its duration.
  const elapsed = new Date(endTime).getTime() - new Date(startTime).getTime();
  if (!Number.isFinite(elapsed) || elapsed < 0) return 0;

  return Math.round((elapsed / 36e5) * 10) / 10;
};
