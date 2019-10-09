const moment = require('moment-timezone');
const { VError } = require('verror');

const bankHolidayDates = require('../../data/bankHolidayDates');
const { daysOfWorkingWeek } = require('./constants');
const config = require('../../config/config');

const { timezone } = config;

function cloneMoment(datetimeMoment, hour, minute) {
  return datetimeMoment.clone()
    .hour(hour)
    .minute(minute)
    .second(0);
}

function getDateTime() {
  if (process.env.DATETIME) {
    const dateTime = moment(process.env.DATETIME, 'YYYY-MM-DD HH:mm', timezone);
    if (!dateTime.isValid()) {
      throw new VError(`Invalid date: ${process.env.DATETIME}`);
    }
    return dateTime;
  }
  return moment().tz(timezone);
}

function getDay(dateString) {
  return moment(dateString).format('dddd');
}

function isBankHoliday(dateString) {
  return bankHolidayDates.some((date) => dateString === date);
}

function isNextOpenTomorrow(nowDateString, nextOpenDateString) {
  const nowDate = moment(nowDateString, 'YYYY-MM-DD');
  const nextOpenDate = moment(nextOpenDateString, 'YYYY-MM-DD');
  return (nextOpenDate.diff(nowDate, 'days') === 1);
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
  const day = moment(datetimeMoment).format('dddd');
  return daysOfWorkingWeek.includes(day);
}

module.exports = {
  getDateTime,
  getDay,
  isBankHoliday,
  isNextOpenTomorrow,
  isTimeOutsideBusinessHours,
  isWeekday,
};
