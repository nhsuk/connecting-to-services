const qs = require('querystring');
const getAddress = require('../lib/getAddress');

function getParams(place) {
  return {
    location: getAddress(place),
    latitude: place.latitude,
    longitude: place.longitude,
  };
}

function createPlaceViewModel(place) {
  return {
    name: place.name_1,
    description: getAddress(place),
    queryString: qs.stringify(getParams(place)),
  };
}

function createPlacesViewModel(places) {
  return places.map(createPlaceViewModel);
}

module.exports = createPlacesViewModel;
