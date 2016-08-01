const daysOfTheWeek = require('./constants').daysOfTheWeek;
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

function formatTime(timeString) {
  const time = getTimeFromString(timeString);
  const formattedTime = getTime(now(), time.hours, time.minutes).format('h:mm a');
  if (formattedTime === '12:00 am' || formattedTime === '11:59 pm') {
    return 'midnight';
  }
  return formattedTime;
}

function formatOpeningTimes(openingTimes) {
  // This mutates the opening hours and so is done after we've finished
  // calculating stuff based on time. Would be better not to do this.
  daysOfTheWeek.forEach((day) => {
    if (openingTimes && openingTimes[day].times[0] !== 'Closed') {
      /* eslint-disable no-param-reassign */
      openingTimes[day].times[0].fromTime = formatTime(openingTimes[day].times[0].fromTime);
      openingTimes[day].times[0].toTime = formatTime(openingTimes[day].times[0].toTime);
      /* eslint-enable no-param-reassign */
    }
  });
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

function getNextOpeningTime(startDateTime, openingTimesForWeek) {
  const dateTime = moment(startDateTime);
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

function getNextClosingTime(startDateTime, openingTimesForWeek) {
  const dateTime = moment(startDateTime);
  let dayCount = 0;
  do {
    const day = dateTime.format('dddd').toLowerCase();
    dateTime.add(1, 'day');
    if (openingTimesForWeek[day].times[0] !== 'Closed') {
      return {
        day: dayCount === 0 ? 'tomorrow' : capitalise(day),
        time: createDateTime(dateTime, openingTimesForWeek[day].times[0].toTime),
      };
    }
    dayCount++;
  } while (dayCount < 7);
  return {};
}

function nextOpen(dateTime, openingTimesForWeek) {
  const day = getDayName(dateTime);

  if (openingTimesForWeek[day].times[0] === 'Closed') {
    return getNextOpeningTime(dateTime, openingTimesForWeek);
  }

  const openingTime = createDateTime(dateTime, openingTimesForWeek[day].times[0].fromTime);

  return (dateTime < openingTime) ?
    { day: 'today', time: openingTime } :
    getNextOpeningTime(dateTime, openingTimesForWeek);
}

function nextClosed(dateTime, openingTimesForWeek) {
  const day = getDayName(dateTime);
  const closingTime = createDateTime(dateTime, openingTimesForWeek[day].times[0].toTime);
  return (dateTime < closingTime) ?
    { day: 'today', time: closingTime } :
    getNextClosingTime(dateTime, openingTimesForWeek);
}

function getOpeningHoursMessage(openingTimes) {
  if (openingTimes === undefined) {
    return 'Opening times not known';
  }

  if (isOpen(now(), openingTimes.today)) {
    const closedNext = nextClosed(now(), openingTimes);
    const closedTime = closedNext.time.format('h:mm a');
    const closedDay = closedNext.day;
    return (
      ((closedDay === 'tomorrow' && closedTime === '12:00 am')
        || (closedDay === 'today' && closedTime === '11:59 pm')) ?
    'Currently open, closes at midnight' :
    `Currently open, closes ${closedDay !== 'today' ? closedDay : ''} at ${closedTime}`);
  }
  const openNext = nextOpen(now(), openingTimes);
  const timeUntilOpen = openNext.time.diff(now(), 'minutes');
  return (
    (timeUntilOpen <= 90) ?
    `Currently closed, opens in ${timeUntilOpen} minutes` :
    `Currently closed, opens ${openNext.day} at ${openNext.time.format('h:mm a')}`);
}

module.exports = {
  timeInRange,
  getDayName,
  isOpen,
  nextOpen,
  nextClosed,
  now,
  nowForDisplay,
  setNow,
  formatOpeningTimes,
  getOpeningHoursMessage,
};

