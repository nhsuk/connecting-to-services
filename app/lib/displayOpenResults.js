const moment = require('moment');

const isRequestForOpenResults = require('./isRequestForOpenResults');

function isInitialRequest(req) {
  return !req.query.open;
}

function isWeekday(datetimeMoment) {
  const dayOfWeek = datetimeMoment.day();
  return dayOfWeek > 0 && dayOfWeek < 6;
}

function isTimeOutsideBusinessHours(datetimeMoment) {
  const businessHoursStart = datetimeMoment.clone().hour(8).minute(0).second(0);
  const businessHoursEnd = datetimeMoment.clone().hour(18).minute(0).second(0);
  return !datetimeMoment.isBetween(businessHoursStart, businessHoursEnd, null, '[)');
}

function displayOpenResults(req, datetimeOverride = process.env.DATETIME) {
  const datetimeMoment = datetimeOverride ? moment(datetimeOverride) : moment();
  let showOpenResults;

  if (isWeekday(datetimeMoment)) {
    if (isTimeOutsideBusinessHours(datetimeMoment) && isInitialRequest(req)) {
      showOpenResults = !isRequestForOpenResults(req);
    } else {
      showOpenResults = isRequestForOpenResults(req);
    }
  } else {
    showOpenResults = isInitialRequest(req)
      ? !isRequestForOpenResults(req)
      : isRequestForOpenResults(req);
  }

  return showOpenResults;
}

module.exports = displayOpenResults;
