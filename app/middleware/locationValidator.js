const log = require('../lib/logger');
const renderer = require('../middleware/renderer');
const isNotEnglishLocation = require('../lib/isNotEnglishLocation');
const locationValidator = require('../lib/locationValidator');

function setLocationLabel(res, location) {
  if (location) {
    // eslint-disable-next-line no-param-reassign
    res.locals.locationLabel = 'Enter a valid postcode';
  }
}

function validateEnglishLocation(req, res, next) {
  const location = res.locals.location;

  log.info('validate-location-start');
  const validationResult = locationValidator(location);
  log.info('validate-location-end');

  // eslint-disable-next-line no-param-reassign
  res.locals.location = validationResult.input;

  if (validationResult.errorMessage) {
    log.info({ location }, 'Location failed validation');
    // eslint-disable-next-line no-param-reassign
    res.locals.errorMessage = validationResult.errorMessage;
    setLocationLabel(res, location);
    renderer.findHelp(req, res);
  } else {
    next();
  }
}

function renderNoResultsPage(req, res) {
  log.info(`Rendering no results page for non-english postcode '${res.locals.location}'`);
  /* eslint-disable no-param-reassign */
  res.locals.nearbyServices = [];
  res.locals.openServices = [];
  /* eslint-enable no-param-reassign*/
  renderer.results(req, res);
}

function validateLocation(req, res, next) {
  if (isNotEnglishLocation(res.locals.location)) {
    renderNoResultsPage(req, res);
  } else {
    validateEnglishLocation(req, res, next);
  }
}

module.exports = validateLocation;
