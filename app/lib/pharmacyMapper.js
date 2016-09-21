const moment = require('moment');
const OpeningTimes = require('moment-opening-times');

function pharmacyMapper(pharmacyList) {
  const viewModels = [];
  pharmacyList.forEach((item, index) => {
    const model = {
      label: 'Pharmacy',
      name: item.content.organisationSummary.name,
      distanceInKms: item.content.organisationSummary.Distance,
      coords: {
        latitude: item.content.organisationSummary.geographicCoordinates.latitude,
        longitude: item.content.organisationSummary.geographicCoordinates.longitude,
      },
      addressLine: item.content.organisationSummary.address.addressLine,
      postcode: item.content.organisationSummary.address.postcode,
      telephone: item.content.organisationSummary.contact.telephone,
    };
    if (item.openingTimes !== undefined) {
      const ot = new OpeningTimes(item.openingTimes, 'Europe/London');
      model.openNow = ot.isOpen(moment());
      model.openingHoursMessage = ot.getOpeningHoursMessage(moment());
      // TODO: assign ot to model.openingTimes but had problems with
      // nunjucks calling, for example, service.openingTimes.getFormattedOpeningTimes()
      // which was throwing an exception
      model.openingTimes = ot.getFormattedOpeningTimes();
    }

    viewModels[index] = model;
  });
  return viewModels;
}

module.exports = pharmacyMapper;
