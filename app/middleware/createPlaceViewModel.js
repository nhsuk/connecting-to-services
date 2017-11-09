const qs = require('querystring');

function getAddress(place) {
  return `${place.name_1}, ${place.county_unitary || place.region}, ${place.outcode}`;
}

function getParams(place) {
  return {
    location: getAddress(place),
    latitude: place.latitude,
    longitude: place.longitude
  };
}

function createPlaceViewModel(place) {
  return {
    name: place.name_1,
    description: getAddress(place),
    queryString: qs.stringify(getParams(place))
  };
}

function createPlacesViewModel(places) {
  return places.map(createPlaceViewModel);
}

module.exports = createPlacesViewModel;
