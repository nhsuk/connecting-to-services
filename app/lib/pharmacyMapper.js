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
      openNow: item.openNow,
      openNext: (item.openNext ?
        `${item.openNext.day} at ${item.openNext.time.format('h:mm a')}` :
        ''),
      addressLine: item.content.organisationSummary.address.addressLine,
      telephone: item.content.organisationSummary.contact.telephone,
    };
    viewModels[index] = model;
  });
  return viewModels;
}

module.exports = pharmacyMapper;
