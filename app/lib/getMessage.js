const OpeningTimes = require('moment-opening-times');

const { timezone } = require('../../config/config');
const getOpeningHoursMessage = require('../lib/getOpeningTimesMessage');
const midnightSpanCorrector = require('../lib/midnightSpanCorrector');

function getOpeningInfo(openingTimes, now) {
  const openingTimesMoment = new OpeningTimes(
    openingTimes.general,
    timezone,
    openingTimes.alterations
  );
  let status = openingTimesMoment.getStatus(now, { next: true });
  status = midnightSpanCorrector(openingTimesMoment, status);
  return {
    isOpen: status.isOpen,
    nextOpen: status.nextOpen,
    openingTimesMessage: getOpeningHoursMessage(status),
  };
}

function getDefault(msg) {
  return {
    isOpen: false,
    openingTimesMessage: msg,
  };
}

module.exports = (openingTimes, hasTelephoneNumber, now) => {
  if (openingTimes) {
    return getOpeningInfo(openingTimes, now);
  }
  if (hasTelephoneNumber) {
    return getDefault('Call for opening times');
  }
  return getDefault('We can\'t find any opening times');
};
