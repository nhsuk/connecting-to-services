const dateUtils = require('../lib/dateUtils');
const daysOfTheWeek = require('../lib/constants').daysOfTheWeek;

function getOpeningTimesForWeek() {
  const dailyOpeningTimes = {};

  daysOfTheWeek.forEach((day) => {
    dailyOpeningTimes[day] =
    {
      times: [
      { fromTime: '08:00',
        toTime: '20:00',
      },
      ],
    };
  });
  const now = dateUtils.now();
  const dayOfWeek = dateUtils.getDayName(now);
  dailyOpeningTimes.today = dailyOpeningTimes[dayOfWeek].times;
  return dailyOpeningTimes;
}

function wicMapper(input) {
  const viewModels = [];


  input.forEach((item, index) => {
    const openingTimes = getOpeningTimesForWeek();
    const model = {
      label: 'Walk-in centre',
      name: item.content.servicesummary.serviceDeliverer.name,
      distanceInKms: item.content.servicesummary.distance,
      coords: item.coords,
      addressLine: item.address,
      postcode: item.postcode,
      telephone: item.telephone,
      openingTimes,
      openingHoursMessage: dateUtils.getOpeningHoursMessage(openingTimes),
    };
    dateUtils.formatOpeningTimes(openingTimes);
    viewModels[index] = model;
  });
  return viewModels;
}

module.exports = wicMapper;
