function closesAtMidnight(moment) {
  const time = moment.format('HH:mm');
  return (time === '00:00' || time === '23:59');
}

function getDayDescriptor(moment, referenceMoment) {
  const dayDescriptors = {
    sameDay: '[today]',
    nextDay: '[tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[yesterday]',
    lastWeek: '[last] dddd',
    sameElse: 'DD/MM/YYYY',
  };
  return moment.calendar(referenceMoment, dayDescriptors);
}

function getOpeningHoursMessage(status) {
  const callForTimesMessage = 'Call for opening times';

  if ((status.isOpen && !status.nextClosed) || (!status.isOpen && !status.nextOpen)) {
    return callForTimesMessage;
  }

  if (status.isOpen === true) {
    if (closesAtMidnight(status.nextClosed)) {
      return 'Open until midnight';
    }
    return `Open until ${status.nextClosed.format('h:mm a')} ` +
      `${getDayDescriptor(status.nextClosed, status.moment)}`;
  } else if (status.isOpen === false) {
    const timeUntilOpen = status.nextOpen.diff(status.moment, 'minutes');
    if (timeUntilOpen <= 60) {
      return `Opening in ${timeUntilOpen} minutes`;
    }
    return `Closed until ${status.nextOpen.format('h:mm a')} ` +
      `${getDayDescriptor(status.nextOpen, status.moment)}`;
  }
  return callForTimesMessage;
}

module.exports = getOpeningHoursMessage;
