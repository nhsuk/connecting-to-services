function getOpeningHoursMessage(status) {
  if (status.isOpen) {
    const closedNext = status.until;
    const closedTime = closedNext.format('h:mm a');
    const closedDay = closedNext.calendar(status.moment, {
      sameDay: '[today]',
      nextDay: '[tomorrow]',
      nextWeek: 'dddd',
      lastDay: '[yesterday]',
      lastWeek: '[last] dddd',
      sameElse: 'DD/MM/YYYY',
    });
    return (
      ((closedDay === 'tomorrow' && closedTime === '12:00 am')
        || (closedDay === 'today' && closedTime === '11:59 pm')) ?
        'Open until midnight' :
        `Open until ${closedTime} ${closedDay}`);
  }
  const openNext = status.until;
  if (!openNext) {
    return 'Call for opening times.';
  }
  const timeUntilOpen = openNext.diff(status.moment, 'minutes');
  const openDay = openNext.calendar(status.moment, {
    sameDay: '[today]',
    nextDay: '[tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[yesterday]',
    lastWeek: '[last] dddd',
    sameElse: 'DD/MM/YYYY',
  });
  return (
    (timeUntilOpen <= 60) ?
      `Opening in ${timeUntilOpen} minutes` :
      `Closed until ${openNext.format('h:mm a')} ${openDay}`);
}

module.exports = getOpeningHoursMessage;
