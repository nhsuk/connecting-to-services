function closesAtMidnight(moment) {
  const time = moment.format('HH:mm');
  return (time === '00:00' || time === '23:59');
}

function getOpeningHoursMessage(status) {
  const dayDescriptors = {
    sameDay: '[today]',
    nextDay: '[tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[yesterday]',
    lastWeek: '[last] dddd',
    sameElse: 'DD/MM/YYYY',
  };
  if (status.isOpen) {
    const closedNext = status.until;
    const closedTime = closedNext.format('h:mm a');
    const closedDay = closedNext.calendar(status.moment, dayDescriptors);
    return (
      closesAtMidnight(closedNext) ?
        'Open until midnight' :
        `Open until ${closedTime} ${closedDay}`);
  }
  const openNext = status.until;
  if (!openNext) {
    return 'Call for opening times.';
  }
  const timeUntilOpen = openNext.diff(status.moment, 'minutes');
  const openDay = openNext.calendar(status.moment, dayDescriptors);
  return (
    (timeUntilOpen <= 60) ?
      `Opening in ${timeUntilOpen} minutes` :
      `Closed until ${openNext.format('h:mm a')} ${openDay}`);
}

module.exports = getOpeningHoursMessage;
