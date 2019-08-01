const OpeningTimes = require('moment-opening-times');

const timezone = require('../../config/config').timezone;
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

function addMessage(openingTimes, hasTelephoneNumber, now) {
  let openingInfo;

  if (openingTimes) {
    openingInfo = getOpeningInfo(openingTimes, now);
  } else if (hasTelephoneNumber) {
    openingInfo = getDefault('Call for opening times');
  } else {
    openingInfo = getDefault('We can\'t find any opening times');
  }

  return openingInfo;
}

module.exports = addMessage;
