const utils = require('../lib/utils');

const minimumCloseTimeMins = 1;
const maxDays = 7;

function immediatelyReopens(openingTimes, closingTime) {
  const nextStatus = openingTimes.getStatus(closingTime, { next: true });
  return nextStatus.nextOpen && nextStatus.nextOpen.diff(closingTime, 'minutes') <= minimumCloseTimeMins;
}

function openingSpansMidnight(openingTimes, nextClosed) {
  return utils.closesAtMidnight(nextClosed) && immediatelyReopens(openingTimes, nextClosed);
}

function getNextClosedIgnoringMidnightSpan(openingTimes, nextClosed) {
  const midnightCloseStatus = openingTimes.getStatus(nextClosed, { next: true });
  const tomorrowOpenStatus = openingTimes.getStatus(midnightCloseStatus.nextOpen, { next: true });
  return tomorrowOpenStatus.nextClosed;
}

function setNextClosedToTomorrow(openingTimes, status) {
  let nextClosed = getNextClosedIgnoringMidnightSpan(openingTimes, status.nextClosed);
  let count = 0;
  while (openingSpansMidnight(openingTimes, nextClosed) && count < maxDays) {
    nextClosed = getNextClosedIgnoringMidnightSpan(openingTimes, nextClosed);
    count += 1;
  }
  /* eslint-disable no-param-reassign */
  status.nextClosed = nextClosed;
  status.open24Hours = count === maxDays;
  /* eslint-enable */
  return status;
}

function correctClosedForOpeningSpansMidnight(status) {
  if (status.isOpen === false && status.moment.format('HH:mm') === '23:59') {
    /* eslint-disable no-param-reassign */
    status.isOpen = true;
    status.nextOpen = status.moment;
    /* eslint-enable */
  }
}

function midnightSpanCorrector(openingTimes, status) {
  if (openingSpansMidnight(openingTimes, status.nextClosed)) {
    correctClosedForOpeningSpansMidnight(status);
    return setNextClosedToTomorrow(openingTimes, status);
  }
  return status;
}

module.exports = midnightSpanCorrector;
