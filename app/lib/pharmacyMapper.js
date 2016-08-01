const dateUtils = require('./dateUtils');
const formatOpeningTimes = dateUtils.formatOpeningTimes;

function pharmacyMapper(input) {
  const viewModels = [];
  input.forEach((item, index) => {
    formatOpeningTimes(item.openingTimes);
    const model = {
      label: 'Pharmacy',
      name: item.content.organisationSummary.name,
      distanceInKms: item.content.organisationSummary.Distance,
      coords: {
        latitude: item.content.organisationSummary.geographicCoordinates.latitude,
        longitude: item.content.organisationSummary.geographicCoordinates.longitude,
      },
      openingTimes: item.openingTimes,
      openNow: item.openNow,
      addressLine: item.content.organisationSummary.address.addressLine,
      postcode: item.content.organisationSummary.address.postcode,
      telephone: item.content.organisationSummary.contact.telephone,
    };
    if (model.openNow) {
      const closedTime = item.closedNext.time.format('h:mm a');
      const closedDay = item.closedNext.day;
      model.closedNext =
            ((closedDay === 'tomorrow' && closedTime === '12:00 am')
          || (closedDay === 'today' && closedTime === '11:59 pm')) ?
          'Currently open, closes at midnight' :
          `Currently open, closes ${closedDay} at ${closedTime}`;
    } else {
      // ignore services with no known opening times
      if (item.openNext) {
        const timeUntilOpen = item.openNext.time.diff(dateUtils.now(), 'minutes');
        model.openNext =
          (timeUntilOpen <= 90) ?
          `Currently closed, opens in ${timeUntilOpen} minutes` :
          `Currently closed, opens ${item.openNext.day} at ${item.openNext.time.format('h:mm a')}`;
      }
    }

    viewModels[index] = model;
  });
  return viewModels;
}

module.exports = pharmacyMapper;
