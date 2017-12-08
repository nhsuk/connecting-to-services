const constants = require('./constants');

function getDateString(dateString = null) {
  return new Date(dateString).toISOString().slice(0, 10);
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
