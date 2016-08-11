const dateUtils = require('../lib/dateUtils');
const daysOfTheWeek = require('../lib/constants').daysOfTheWeek;
const OpeningTimes = require('./OpeningTimes');

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
  return new OpeningTimes(dailyOpeningTimes);
}

function wicMapper(input) {
  const viewModels = [];


  input.forEach((item, index) => {
    const model = {
      label: 'Walk-in centre',
      name: item.content.servicesummary.serviceDeliverer.name,
      distanceInKms: item.content.servicesummary.distance,
      coords: item.coords,
      addressLine: item.address,
      postcode: item.postcode,
      telephone: item.telephone,
    };
    const ot = getOpeningTimesForWeek();
    model.openNow = ot.isOpen(dateUtils.now());
    model.openingHoursMessage = ot.getOpeningHoursMessage(dateUtils.now());
    model.openingTimes = ot.getFormattedOpeningTimes();
    viewModels[index] = model;
  });
  return viewModels;
}

module.exports = wicMapper;
