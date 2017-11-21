const constants = require('../lib/constants');
const handleReverseGeocodeError = require('../lib/handleReverseGeocodeError');
const postcodes = require('../lib/postcodes');
const renderer = require('./renderer');
const reverseGeocode = require('../lib/reverseGeocodeLookup');
const skipLatLongLookup = require('./skipLatLongLookup');

function coordinateResolver(req, res, next) {
  function afterLookup(err) {
    if (err) {
      switch (err.type) {
        case 'invalid-postcode':
          res.locals.errorMessage = err.message;
          renderer.findHelp(req, res);
          break;
        case 'postcode-service-error':
          next(`Postcode Service Error: ${err.message}`);
          break;
        default:
          next('Unknown Error');
      }
    } else {
      next();
    }
  }

  if (res.locals.location === constants.yourLocation) {
    reverseGeocode(req, res, next).catch(error => handleReverseGeocodeError(error, next));
  } else if (skipLatLongLookup(res)) {
    next();
  } else {
    postcodes.lookup(res, afterLookup);
  }
}

module.exports = coordinateResolver;
