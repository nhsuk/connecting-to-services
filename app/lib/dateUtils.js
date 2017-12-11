const constants = require('./constants');

function getDateString(dateString) {
  // eslint-disable-next-line no-restricted-globals
  const date = (isNaN(Date.parse(dateString)))
    ? new Date()
    : new Date(dateString);
  return date.toISOString().slice(0, 10);
}

function getDay(dateString) {
  return constants.daysOfWeek[new Date(dateString).getDay()];
}

function isNextOpenTomorrow(nowDateString, nextOpenDateString) {
  const nowDate = new Date(nowDateString);
  const nextOpenDate = new Date(nextOpenDateString);
  return ((nextOpenDate - nowDate) === constants.dayInMilliseconds);
}

module.exports = {
  getDateString,
  getDay,
  isNextOpenTomorrow,
};
