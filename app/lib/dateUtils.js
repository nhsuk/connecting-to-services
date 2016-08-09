const moment = require('moment');
require('moment-timezone');


function getDayName(date) {
  return date.format('dddd').toLowerCase();
}

function now() {
  return global.now || moment();
}

function nowForDisplay() {
  return now().tz('Europe/London').format('dddd HH:mm');
}

function setNow(datetime) {
  global.now = datetime ? moment.tz(datetime, 'Europe/London') : datetime;
}

module.exports = {
  getDayName,
  now,
  nowForDisplay,
  setNow,
};

