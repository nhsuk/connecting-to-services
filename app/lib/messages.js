const constants = require('./constants');

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
  let message;
  const nowDate = new Date(now);
  const nextOpenDate = new Date(nextOpen);

  if ((nextOpenDate - nowDate) === constants.dayInMilliseconds) {
    message = 'Tomorrow is a bank holiday. Please call to check opening times.';
  } else {
    message = `${constants.dayOfWeekPrefixes[nextOpenDate.getDay()]}day is a bank holiday. Please call to check opening times.`;
  }
  return message;
}

module.exports = {
  bankHolidayToday,
  bankHolidayFuture,
  emptyPostcodeMessage,
  invalidPostcodeMessage,
  technicalProblems,
};
