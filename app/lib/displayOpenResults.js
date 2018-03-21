const moment = require('moment');

const dateUtils = require('./dateUtils');
const isRequestForOpenResults = require('./isRequestForOpenResults');

function isRequestInitial(req) {
  return !req.query.open;
}

function isRequestInitialAndWeekdayOutsideBusinessHours(req, datetimeMoment) {
  return dateUtils.isWeekday(datetimeMoment)
    && dateUtils.isTimeOutsideBusinessHours(datetimeMoment)
    && isRequestInitial(req);
}

function isRequestInitialAndWeekend(req, datetimeMoment) {
  return !dateUtils.isWeekday(datetimeMoment) && isRequestInitial(req);
}

function isRequestInitialAndOutsideBusinessHours(req, datetimeMoment) {
  return isRequestInitialAndWeekdayOutsideBusinessHours(req, datetimeMoment)
    || isRequestInitialAndWeekend(req, datetimeMoment);
}

function displayOpenResults(req, datetimeOverride = process.env.DATETIME) {
  const datetimeMoment = datetimeOverride ? moment(datetimeOverride) : moment();
  return isRequestInitialAndOutsideBusinessHours(req, datetimeMoment)
    ? !isRequestForOpenResults(req)
    : isRequestForOpenResults(req);
}

module.exports = displayOpenResults;
