const {
  placeSearch, postcodeSearch, yourLocation, yourLocationSearch,
} = require('../lib/constants');
const isPostcode = require('../lib/isPostcode');

function noCoordinates(coordinates) {
  return coordinates === undefined || coordinates.latitude === undefined;
}

function getSearchType(location, coordinates) {
  if (location === yourLocation) {
    return yourLocationSearch;
  }
  if (isPostcode(location) && noCoordinates(coordinates)) {
    return postcodeSearch;
  }
  return placeSearch;
}

module.exports = getSearchType;
