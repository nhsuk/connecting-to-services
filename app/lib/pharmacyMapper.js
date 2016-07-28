function pharmacyMapper(input) {
  const viewModels = [];
  input.forEach((item, index) => {
    const model = {};
    model.label = 'Pharmacy';
    model.name = item.content.organisationSummary.name;
    model.distanceInKms = item.content.organisationSummary.Distance;
    model.coords = {
      latitude: item.content.organisationSummary.geographicCoordinates.latitude,
      longitude: item.content.organisationSummary.geographicCoordinates.longitude,
    };
    model.openingTimes = item.openingTimes;
    model.openNow = item.openNow;
    model.addressLine = item.content.organisationSummary.address.addressLine;
    model.telephone = item.content.organisationSummary.contact.telephone;
    viewModels[index] = model;
  });
  return viewModels;
}

module.exports = pharmacyMapper;
