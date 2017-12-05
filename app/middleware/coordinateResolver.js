const constants = require('../lib/constants');
const postcodes = require('../lib/postcodes');
const routeHelper = require('./routeHelper');
const reverseGeocode = require('../lib/reverseGeocodeLookup');
const skipLatLongLookup = require('./skipLatLongLookup');

function isNumber(val) {
  return typeof val === 'number';
}

function latLongPopulated(res) {
  const coords = res.locals.coordinates;
  return isNumber(coords.longitude) && isNumber(coords.latitude);
}

function coordinateResolver(req, res, next) {
  function afterLookup(err) {
    if (err) {
      switch (err.type) {
        case 'invalid-postcode':
          routeHelper.renderFindHelpPage(req, res, err.type, err.message);
          break;
        case 'postcode-service-error':
          next(`Postcode Service Error: ${err.message}`);
          break;
        default:
          next('Unknown Error');
      }
    } else if (latLongPopulated(res)) {
      next();
    } else {
      routeHelper.renderNoResultsPage(req, res, 'Lat long missing', 'Non-English postcode');
    }
  }

  if (res.locals.searchType === constants.yourLocationSearch) {
    reverseGeocode(req, res, next);
  } else if (skipLatLongLookup(res)) {
    // lat long lookup is only skipped on links from the disambiguation page
    // these will always be in England
    res.locals.countries = ['England'];
    next();
  } else {
    postcodes.lookup(res, afterLookup);
  }
}

module.exports = coordinateResolver;
