const moment = require('moment');

const dateUtils = require('./dateUtils');
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

function displayOpenResults(req, datetimeOverride = process.env.DATETIME) {
  // TODO: should we use a lib method for getDateTime
  const datetimeMoment = datetimeOverride ? moment(datetimeOverride) : moment();
  return isRequestInitialAndOutsideBusinessHours(req, datetimeMoment)
    ? !isRequestForOpenResults(req)
    : isRequestForOpenResults(req);
}

module.exports = displayOpenResults;
