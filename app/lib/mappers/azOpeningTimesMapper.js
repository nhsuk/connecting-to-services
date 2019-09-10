const moment = require('moment');

function getTimesFromString(timesString) {
  const splitTimes = timesString.split('-');
  const opens = splitTimes[0];
  const closes = splitTimes[1];
  return { closes, opens };
}

function getOpeningTimes(asOpeningTimes) {
  const weekdays = moment.weekdays();
  const openingTimes = {
    alterations: {},
    general: {},
  };

  // Get opening times for each day of week
  weekdays.forEach((weekday) => {
    const sessions = asOpeningTimes
      .filter(ot => ot.OpeningTimeType === 'General' && ot.Weekday === weekday)
      .map(wot => getTimesFromString(wot.Times));
    openingTimes.general[weekday.toLowerCase()] = sessions;
  });

  // Get opening times for alterations/additional days
  asOpeningTimes
    .filter(ot => ot.OpeningTimeType === 'General' && ot.AdditionalOpeningDate)
    .forEach((aot) => {
      const aMoment = moment(aot.AdditionalOpeningDate, 'MMM DD YYYY');
      if (!openingTimes.alterations[aMoment.format('YYYY-MM-DD')]) {
        // initialise alterations for date
        openingTimes.alterations[aMoment.format('YYYY-MM-DD')] = [];
      }
      if (aot.IsOpen) {
        openingTimes.alterations[aMoment.format('YYYY-MM-DD')].push(getTimesFromString(aot.Times));
      }
    });

  return openingTimes;
}

module.exports = getOpeningTimes;
