const bankHolidayDates = require('../../data/bankHolidayDates');
const constants = require('./constants');
const config = require('../../config/config');

function cloneMoment(datetimeMoment, hour, minute) {
  return datetimeMoment.clone()
    .hour(hour)
    .minute(minute)
    .second(0);
}

function getDateString(dateString) {
  // eslint-disable-next-line no-restricted-globals
  const date = (isNaN(Date.parse(dateString)))
    ? new Date()
    : new Date(dateString);
  return date.toISOString().slice(0, 10);
}

function getDay(dateString) {
  return constants.daysOfWeek[new Date(dateString).getDay()];
}

function isBankHoliday(dateString) {
  return bankHolidayDates.some(date => dateString === date);
}

function isNextOpenTomorrow(nowDateString, nextOpenDateString) {
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
  const dayOfWeek = datetimeMoment.day();
  return dayOfWeek > 0 && dayOfWeek < 6;
}

module.exports = {
  getDateString,
  getDay,
  isBankHoliday,
  isNextOpenTomorrow,
  isTimeOutsideBusinessHours,
  isWeekday,
};
