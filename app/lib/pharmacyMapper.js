const dateUtils = require('./dateUtils');


function pharmacyMapper(input) {
  const viewModels = [];
  input.forEach((item, index) => {
    const model = {
      label: 'Pharmacy',
      name: item.content.organisationSummary.name,
      distanceInKms: item.content.organisationSummary.Distance,
      coords: {
        latitude: item.content.organisationSummary.geographicCoordinates.latitude,
        longitude: item.content.organisationSummary.geographicCoordinates.longitude,
      },
      openingTimes: item.openingTimes,
      openingHoursMessage: dateUtils.getOpeningHoursMessage(item.openingTimes),
      addressLine: item.content.organisationSummary.address.addressLine,
      telephone: item.content.organisationSummary.contact.telephone,
    };

    dateUtils.formatOpeningTimes(item.openingTimes);
    viewModels[index] = model;
  });
  return viewModels;
}

module.exports = pharmacyMapper;
