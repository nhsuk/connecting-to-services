const {
  getDateTime, isBankHoliday, isWeekday, isTimeOutsideBusinessHours,
} = require('./dateUtils');
const isRequestForOpenResults = require('./isRequestForOpenResults');

function isRequestInitial(req) {
  return !req.query.open;
}

function isRequestInitialAndWeekdayOutsideBusinessHours(req, datetimeMoment) {
  return isRequestInitial(req)
    && isWeekday(datetimeMoment)
    && isTimeOutsideBusinessHours(datetimeMoment);
}

function isRequestInitialAndWeekend(req, datetimeMoment) {
  return isRequestInitial(req)
    && !isWeekday(datetimeMoment);
}

function isRequestInitialAndBankHoliday(req, datetimeMoment) {
  return isRequestInitial(req)
    && isBankHoliday(datetimeMoment.format('YYYY-MM-DD'));
}

function isRequestInitialAndOutsideBusinessHours(req, datetimeMoment) {
  return isRequestInitialAndWeekdayOutsideBusinessHours(req, datetimeMoment)
    || isRequestInitialAndWeekend(req, datetimeMoment)
    || isRequestInitialAndBankHoliday(req, datetimeMoment);
}

function displayOpenResults(req) {
  const datetimeMoment = getDateTime();
  return isRequestInitialAndOutsideBusinessHours(req, datetimeMoment)
    ? !isRequestForOpenResults(req)
    : isRequestForOpenResults(req);
}

module.exports = displayOpenResults;
