const utils = require('../lib/utils');

function getDayDescriptor(moment, referenceMoment) {
  const dayDescriptors = {
    lastDay: '[yesterday]',
    lastWeek: '[last] dddd',
    nextDay: '[tomorrow]',
    nextWeek: 'dddd',
    sameDay: '[today]',
    sameElse: 'DD/MM/YYYY',
  };
  return moment.calendar(referenceMoment, dayDescriptors);
}

function midnightAs0000Tomorrow(nextClosed, dayDesc) {
  return nextClosed.format('HH:mm') === '00:00' && dayDesc === 'tomorrow';
}

function getOpenUntilMidnightMessage(status) {
  const message = 'Open until midnight';
  const dayDesc = getDayDescriptor(status.nextClosed, status.moment);
  if (dayDesc === 'today' || midnightAs0000Tomorrow(status.nextClosed, dayDesc)) {
    return message;
  }
  return `${message} ${dayDesc}`;
}

function formatTime(moment) {
  const formatString = moment.minutes() === 0 ? 'ha' : 'h:mma';
  return moment.format(formatString);
}

function getClosedMessage(status) {
  const timeUntilOpen = Math.ceil(status.nextOpen.diff(status.moment, 'minutes', true));
  if (timeUntilOpen <= 60) {
    const unit = timeUntilOpen > 1 ? 'minutes' : 'minute';
    return `Open in ${timeUntilOpen} ${unit}`;
  }
  return `Closed until ${formatTime(status.nextOpen)} `
    + `${getDayDescriptor(status.nextOpen, status.moment)}`;
}

function nextTimeMissing(status) {
  return (status.isOpen && !status.nextClosed) || (!status.isOpen && !status.nextOpen);
}

function getOpenUntilMessage(status) {
  return `Open until ${formatTime(status.nextClosed)} `
    + `${getDayDescriptor(status.nextClosed, status.moment)}`;
}

function getOpeningHoursMessage(status) {
  const callForTimesMessage = 'Call for opening times';
  if (nextTimeMissing(status)) {
    return callForTimesMessage;
  }
  if (status.open24Hours === true) {
    return 'Open 24 hours';
  }
  if (status.isOpen === true) {
    if (utils.closesAtMidnight(status.nextClosed)) {
      return getOpenUntilMidnightMessage(status);
    }
    return getOpenUntilMessage(status);
  }
  if (status.isOpen === false) {
    return getClosedMessage(status);
  }
  return callForTimesMessage;
}

module.exports = getOpeningHoursMessage;
