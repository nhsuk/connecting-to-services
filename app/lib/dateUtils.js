const moment = require('moment');
require('moment-timezone');

function getDayName(date) {
  return date.format('dddd').toLowerCase();
}

function now() {
  return global.now || moment();
}

function nowForDisplay() {
  return now().tz('Europe/London').format('dddd HH:mm');
}

function setNow(datetime) {
  global.now = datetime ? moment.tz(datetime, 'Europe/London') : datetime;
}

function getTime(date, hour, minute) {
  const returnDate = date.clone().tz('Europe/London');
  returnDate.set({
    hour,
    minute,
    second: 0,
    millisecond: 0,
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

  let start = getTime(date, openTime.hours, openTime.minutes);
  let end = getTime(date, closeTime.hours, closeTime.minutes);

  if (end < start) {
    if (date.isSameOrBefore(end)) {
      start = start.subtract(1, 'day');
    } else {
      end = end.add(1, 'day');
    }
  }

  // console.log([date.format(), start.format(), end.format()]);
  return date.isBetween(start, end, null, '[]');
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

function createDateTime(dateTime, timeString) {
  const time = getTimeFromString(timeString);
  return getTime(dateTime, time.hours, time.minutes).tz('Europe/London');
}

function capitalise(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getNextOpeningTime(dateTime, openingTimesForWeek) {
  let dayCount = 0;
  do {
    dateTime.add(1, 'day');
    const day = dateTime.format('dddd').toLowerCase();
    if (openingTimesForWeek[day].times[0] !== 'Closed') {
      return {
        day: dayCount === 0 ? 'tomorrow' : capitalise(day),
        time: createDateTime(dateTime, openingTimesForWeek[day].times[0].fromTime),
      };
    }
    dayCount++;
  } while (dayCount < 7);
  return {};
}

function nextOpen(dateTime, openingTimesForWeek) {
  const day = getDayName(dateTime);
  const openingTime = createDateTime(dateTime, openingTimesForWeek[day].times[0].fromTime);

  return (dateTime < openingTime) ?
    { day: 'today', time: openingTime } :
    getNextOpeningTime(dateTime, openingTimesForWeek);
}

module.exports = {
  timeInRange,
  getDayName,
  isOpen,
  nextOpen,
  now,
  nowForDisplay,
  setNow,
};

