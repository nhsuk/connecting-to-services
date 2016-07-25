const moment = require('moment');

function getDayName(date) {
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  return days[date.getDay()];
}

function getTime(date, hours, minutes) {

  const returnDate = date.clone();
  returnDate.set({
    'hour': hours,
    'minute': minutes,
    second: 0,
    millisecond: 0
  });

  return returnDate;
}

function getTimeFromString(timeString) {
  return {
    hours: parseInt(timeString.split(':')[0], 10),
    minutes: parseInt(timeString.split(':')[1], 10),
  };
}

function timeInRange(date, open, close) {
  const openTime = getTimeFromString(open);
  const closeTime = getTimeFromString(close);

  const start = getTime(date, openTime.hours, openTime.minutes);
  let end = getTime(date, closeTime.hours, closeTime.minutes);

  if (end < start) {
    end = end.add(1, 'day');
  }

  console.log([date.format(), start.format(), end.format()]);
  return start <= date && date <= end;
}

function isOpen(date, openingTimes) {
  // TODO: handle multiple opening times during a day (e.g. when closed for lunch
  return openingTimes[0] !== 'Closed' &&
    timeInRange(
    date,
    openingTimes[0].fromTime,
    openingTimes[0].toTime
  );
}

module.exports = {
  timeInRange,
  getDayName,
  isOpen,
};

