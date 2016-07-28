function wicMapper(input) {
  const viewModels = [];
  input.forEach((item, index) => {
    const model = {
      label: 'Walk-in centre',
      name: item.content.servicesummary.serviceDeliverer.name,
      distanceInKms: item.content.servicesummary.distance,
      coords: item.coords,
      addressLine: item.address,
      telephone: item.telephone,
    };
    viewModels[index] = model;
  });
  return viewModels;
}

module.exports = wicMapper;
