const qs = require('querystring');
const getAddress = require('../lib/getAddress');

function getParams(place) {
  return {
    latitude: place.latitude,
    location: getAddress(place),
    longitude: place.longitude,
  };
}

function createPlaceViewModel(place) {
  return {
    description: getAddress(place),
    name: place.name_1,
    queryString: qs.stringify(getParams(place)),
  };
}

function createPlacesViewModel(places) {
  return places.map(createPlaceViewModel);
}

module.exports = createPlacesViewModel;
