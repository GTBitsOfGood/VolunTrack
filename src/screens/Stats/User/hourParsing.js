export const getHours = (startTime, endTime) => {
  var timeStart = new Date("01/01/2007 " + startTime);
  var timeEnd = new Date("01/01/2007 " + endTime);

  let hours = Math.abs(timeEnd - timeStart) / 36e5;

  if (hours < 0) {
    hours = 24 + hours;
  }

  return Math.round(hours * 10) / 10.0;
};
