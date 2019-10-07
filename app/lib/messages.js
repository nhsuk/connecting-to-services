const dateUtils = require('./dateUtils');

function invalidPostcodeMessage(location) {
  return `We can't find the postcode '${location}'. Check the postcode is correct and try again.`;
}

function emptyPostcodeMessage() {
  return 'This field is required.';
}

function technicalProblems() {
  return 'Sorry, we are experiencing technical problems';
}

function bankHolidayToday() {
  return 'Today is a bank holiday. Please call to check opening times.';
}

function bankHolidayFuture(now, nextOpen) {
  return dateUtils.isNextOpenTomorrow(now, nextOpen)
    ? 'Tomorrow is a bank holiday. Please call to check opening times.'
    : `${dateUtils.getDay(nextOpen)} is a bank holiday. Please call to check opening times.`;
}

module.exports = {
  bankHolidayFuture,
  bankHolidayToday,
  emptyPostcodeMessage,
  invalidPostcodeMessage,
  technicalProblems,
};
