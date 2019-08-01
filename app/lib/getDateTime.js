const moment = require('moment');
const log = require('../lib/logger');
// use this instead of moment to control current date for testing purposes

function getDateTime() {
  const now = process.env.DATETIME || Date.now();
  log.debug({ date: now }, 'Date of request');

  return moment(now);
}

module.exports = getDateTime;
