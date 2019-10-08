const moment = require('moment');

function getTimesFromString(timesString) {
  const splitTimes = timesString.split('-');
  const opens = splitTimes[0];
  const closes = splitTimes[1];
  return { closes, opens };
}

function getGeneralOpeningTimes(asOpeningTimes) {
  const weekdays = moment.weekdays();
  const general = {};
  weekdays.forEach((weekday) => {
    const sessions = asOpeningTimes
      .filter((ot) => ot.Weekday === weekday)
      .map((wot) => getTimesFromString(wot.Times));
    general[weekday.toLowerCase()] = sessions;
  });
  return general;
}

function getAlterationsOpeningTimes(asOpeningTimes) {
  const alterations = {};
  asOpeningTimes
    .filter((ot) => ot.AdditionalOpeningDate)
    .forEach((aot) => {
      const aMoment = moment(aot.AdditionalOpeningDate, 'MMM DD YYYY');
      if (!alterations[aMoment.format('YYYY-MM-DD')]) {
        // initialise alterations for date
        alterations[aMoment.format('YYYY-MM-DD')] = [];
      }
      if (aot.IsOpen) {
        alterations[aMoment.format('YYYY-MM-DD')].push(getTimesFromString(aot.Times));
      }
    });
  return alterations;
}

function getOpeningTimes(asOpeningTimes) {
  return {
    alterations: getAlterationsOpeningTimes(asOpeningTimes),
    general: getGeneralOpeningTimes(asOpeningTimes),
  };
}

module.exports = getOpeningTimes;
