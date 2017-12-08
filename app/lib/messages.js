const constants = require('./constants');
const isNextOpenTomorrow = require('./dateUtils').isNextOpenTomorrow;

function invalidPostcodeMessage(location) {
  return `We can't find the postcode '${location}'. Check the postcode is correct and try again.`;
}

function emptyPostcodeMessage() {
  return 'You must enter a town, city or postcode to find a pharmacy.';
}

function technicalProblems() {
  return 'Sorry, we are experiencing technical problems';
}

function bankHolidayToday() {
  return 'Today is a bank holiday. Please call to check opening times.';
}

function bankHolidayFuture(now, nextOpen) {
  return isNextOpenTomorrow(now, nextOpen)
    ? 'Tomorrow is a bank holiday. Please call to check opening times.'
    : `${constants.dayOfWeekPrefixes[new Date(nextOpen).getDay()]}day is a bank holiday. Please call to check opening times.`;
}

module.exports = {
  bankHolidayFuture,
  bankHolidayToday,
  emptyPostcodeMessage,
  invalidPostcodeMessage,
  technicalProblems,
};
