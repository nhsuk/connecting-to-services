const getDisplayLocation = require('./getDisplayLocation');

const titlePrefix = 'Find a pharmacy';

function search(location, errorMessage) {
  if (!errorMessage) {
    return titlePrefix;
  }

  return location ?
    `${titlePrefix} - We can't find the postcode '${location.toUpperCase()}'` :
    `${titlePrefix} - Enter a town, city or postcode, or use your location`;
}

function disambiguation(location, places) {
  return places.length === 0 ?
    `${titlePrefix} - We can't find '${location}'` :
    `${titlePrefix} - Places that match '${location}'`;
}

function results(location, services) {
  return services.length === 0 ?
    `${titlePrefix} - We can't find any pharmacies near ${getDisplayLocation(location)}` :
    `Pharmacies near ${getDisplayLocation(location)}`;
}

module.exports = {
  search,
  disambiguation,
  results
};
