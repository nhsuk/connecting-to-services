const constants = require('../lib/constants');

function getRequestUrl(coordinates, displayOpenResults) {
  const numberOfResults =
    displayOpenResults ? constants.api.openResultsCount : constants.api.nearbyResultsCount;

  const baseUrl = process.env.API_BASE_URL;
  const path = displayOpenResults ? constants.api.paths.open : constants.api.paths.nearby;
  return `${baseUrl}/${path}?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&limits:results=${numberOfResults}`;
}

module.exports = getRequestUrl;
