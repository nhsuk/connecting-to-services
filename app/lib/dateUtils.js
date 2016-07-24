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
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes).getTime();
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

  const ref = date.getTime();
  const start = getTime(date, openTime.hours, openTime.minutes);
  let end = getTime(date, closeTime.hours, closeTime.minutes);

  if (end < start) {
    end = new Date(end).getTime() + 86400000;
  }

  return start <= ref && ref <= end;
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

