const constants = require('../lib/constants');
const isPostcode = require('../lib/isPostcode');

function noCoordinates(coordinates) {
  return coordinates === undefined || coordinates.latitude === undefined;
}

function getSearchType(location, coordinates) {
  if (location === constants.yourLocation) {
    return constants.yourLocationSearch;
  }
  if (isPostcode(location) && noCoordinates(coordinates)) {
    return constants.postcodeSearch;
  }
  return constants.placeSearch;
}

module.exports = getSearchType;
