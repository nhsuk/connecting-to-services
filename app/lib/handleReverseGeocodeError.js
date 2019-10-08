const log = require('../lib/logger');

function handleReverseGeocodeError(error, next) {
  log.error(error, 'Reverse geocode lookup error');
  next({ message: error.message, type: 'reverse-geocode-lookup-error' });
}

module.exports = handleReverseGeocodeError;
