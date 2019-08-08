const moment = require('moment-timezone');
const log = require('../lib/logger');
// use this instead of moment to control current date for testing purposes
const timezone = require('../../config/config').timezone;

function getDateTime() {
  const now = process.env.DATETIME ? moment(process.env.DATETIME) : moment().tz(timezone);
  log.debug({ date: now }, 'Date of request');
  return now;
}

module.exports = getDateTime;
