const dateUtils = require('./dateUtils');
const getDateTime = require('./getDateTime');
const isRequestForOpenResults = require('./isRequestForOpenResults');

function isRequestInitial(req) {
  return !req.query.open;
}

function isRequestInitialAndWeekdayOutsideBusinessHours(req, datetimeMoment) {
  return isRequestInitial(req)
    && dateUtils.isWeekday(datetimeMoment)
    && dateUtils.isTimeOutsideBusinessHours(datetimeMoment);
}

function isRequestInitialAndWeekend(req, datetimeMoment) {
  return isRequestInitial(req)
    && !dateUtils.isWeekday(datetimeMoment);
}

function isRequestInitialAndBankHoliday(req, datetimeMoment) {
  return isRequestInitial(req)
    && dateUtils.isBankHoliday(datetimeMoment.format('YYYY-MM-DD'));
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
