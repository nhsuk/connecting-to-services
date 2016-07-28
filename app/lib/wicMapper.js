function wicMapper(input) {
  const viewModels = [];
  input.forEach((item, index) => {
    const model = {};
    model.label = 'Walk-in centre';
    model.name = item.content.servicesummary.serviceDeliverer.name;
    model.distanceInKms = item.content.servicesummary.distance;
    // coords come from the 'overview' page so require another request
    // as does most of the rest of the data
    // model.coors = {};
    viewModels[index] = model;
  });
  return viewModels;
}

module.exports = wicMapper;
