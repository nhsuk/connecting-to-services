const log = require('../lib/logger');

function handleReverseGeocodeError(error, next) {
  log.error({ postcodeLookupResponse: { error } }, 'Reverse geocode lookup error');
  next({ type: 'reverse-geocode-lookup-error', message: error.message });
}

module.exports = handleReverseGeocodeError;
