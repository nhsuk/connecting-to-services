const qs = require('querystring');

function getParams(place) {
  return {
    location: place.name_1,
    latitude: place.latitude,
    longitude: place.longitude
  };
}

function createPlaceViewModel(place) {
  return {
    name: place.name_1,
    description: `${place.name_1}, ${place.county_unitary || place.region}, ${place.outcode}`,
    queryString: qs.stringify(getParams(place))
  };
}

function createPlacesViewModel(places) {
  return places.map(createPlaceViewModel);
}

module.exports = createPlacesViewModel;
