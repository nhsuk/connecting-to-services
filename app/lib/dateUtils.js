const constants = require('./constants');

function getDateString(dateString) {
  // eslint-disable-next-line no-restricted-globals
  const date = (isNaN(Date.parse(dateString)))
    ? new Date()
    : new Date(dateString);
  return date.toISOString().slice(0, 10);
}

function isNextOpenTomorrow(now, nextOpen) {
  const nowDate = new Date(now);
  const nextOpenDate = new Date(nextOpen);
  return ((nextOpenDate - nowDate) === constants.dayInMilliseconds);
}

module.exports = {
  isNextOpenTomorrow,
  getDateString,
};
