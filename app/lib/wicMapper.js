const dateUtils = require('../lib/dateUtils.js');
const daysOfTheWeek = require('../lib/constants').daysOfTheWeek;

function wicMapper(input) {
  const viewModels = [];
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

  input.forEach((item, index) => {
    const model = {
      label: 'Walk-in centre',
      name: item.content.servicesummary.serviceDeliverer.name,
      distanceInKms: item.content.servicesummary.distance,
      coords: item.coords,
      addressLine: item.address,
      telephone: item.telephone,
      openingTimes: dailyOpeningTimes,
      openNow: dateUtils.isOpen(now, dailyOpeningTimes.today),
    };
    viewModels[index] = model;
  });
  return viewModels;
}

module.exports = wicMapper;
