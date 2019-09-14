const moment = require('moment-timezone');
const VError = require('verror').VError;

const bankHolidayDates = require('../../data/bankHolidayDates');
const constants = require('./constants');
const config = require('../../config/config');

const timezone = config.timezone;

function cloneMoment(datetimeMoment, hour, minute) {
  return datetimeMoment.clone()
    .hour(hour)
    .minute(minute)
    .second(0);
}

function getDateTime() {
  if (process.env.DATETIME) {
    const dateTime = moment(process.env.DATETIME, 'YYYY-MM-DD HH:mm').tz(timezone);
    if (!dateTime.isValid()) {
      throw new VError(`Invalid date: ${process.env.DATETIME}`);
    }
    return dateTime;
  }
  return moment().tz(timezone);
}

function getDay(dateString) {
  // TODO: use moment to get day
  return moment(dateString).format('dddd');
}

function isBankHoliday(dateString) {
  return bankHolidayDates.some(date => dateString === date);
}

function isNextOpenTomorrow(nowDateString, nextOpenDateString) {
  // TODO - use moment functionality here
  const nowDate = new Date(nowDateString);
  const nextOpenDate = new Date(nextOpenDateString);
  return ((nextOpenDate - nowDate) === constants.dayInMilliseconds);
}

function isTimeOutsideBusinessHours(datetimeMoment) {
  const businessHoursStart = cloneMoment(
    datetimeMoment,
    config.businessHours.start.hour,
    config.businessHours.start.minute
  );
  const businessHoursEnd = cloneMoment(
    datetimeMoment,
    config.businessHours.end.hour,
    config.businessHours.end.minute
  );
  return !datetimeMoment.isBetween(businessHoursStart, businessHoursEnd, null, '[)');
}

function isWeekday(datetimeMoment) {
  // TODO - use moment functionality here
  const dayOfWeek = datetimeMoment.day();
  return dayOfWeek > 0 && dayOfWeek < 6;
}

module.exports = {
  getDateTime,
  getDay,
  isBankHoliday,
  isNextOpenTomorrow,
  isTimeOutsideBusinessHours,
  isWeekday,
};
