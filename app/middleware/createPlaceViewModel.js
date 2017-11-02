function createPlaceViewModel(place) {
  return {
    name: place.name_1,
    description: `${place.name_1}, ${place.county_unitary || place.region}, ${place.outcode}`,
    queryString: `location=${place.name_1}&latitude=${place.latitude}&longitude=${place.longitude}`,
  };
}

function createPlacesViewModel(req, res, next) {
  res.locals.places = res.locals.places.map(createPlaceViewModel);
  next();
}

module.exports = createPlacesViewModel;
