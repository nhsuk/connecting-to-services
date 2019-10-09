const { app: { title: appTitle } } = require('./constants');
const getDisplayLocation = require('./getDisplayLocation');

function search(location, errorMessage) {
  if (!errorMessage) {
    return appTitle;
  }

  return location ? `${appTitle} - We can't find the postcode '${location.toUpperCase()}'`
    : `${appTitle} - Enter a town, city or postcode, or use your location`;
}

function disambiguation(location, places) {
  return places.length === 0 ? `${appTitle} - We can't find '${location}'`
    : `${appTitle} - Places that match '${location}'`;
}

function results(location, services) {
  return services.length === 0 ? `${appTitle} - We can't find any pharmacies near ${getDisplayLocation(location)}`
    : `Pharmacies near ${getDisplayLocation(location)}`;
}

module.exports = {
  disambiguation,
  results,
  search,
};
