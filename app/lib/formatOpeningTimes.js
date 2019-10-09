const moment = require('moment');

const { daysOfWeekOrderedForUi } = require('./constants');

function formatTimeString(timeString) {
  const time = moment();
  const [hours, minutes] = timeString.split(':').map(Number);
  time.minute(minutes);
  time.hour(hours);
  const formatString = time.minutes() === 0 ? 'ha' : 'h:mma';
  return time.format(formatString);
}

function formatTimes(session) {
  return {
    closes: formatTimeString(session.closes),
    opens: formatTimeString(session.opens),
  };
}

function mapDay(sessions) {
  return sessions ? sessions.map(formatTimes) : undefined;
}

function toDayObject(day, times) {
  return {
    day,
    openingTimes: mapDay(times[day.toLowerCase()]),
  };
}
function isOpen(times) {
  return daysOfWeekOrderedForUi.some((day) => {
    // eslint-disable-next-line prefer-destructuring
    const daySessions = times[day.toLowerCase()];
    return daySessions && daySessions.length > 0;
  });
}

function formatOpeningTimes(openingTimes) {
  if (openingTimes && openingTimes.general && isOpen(openingTimes.general)) {
    return daysOfWeekOrderedForUi.map((day) => toDayObject(day, openingTimes.general));
  }
  return undefined;
}

module.exports = formatOpeningTimes;
