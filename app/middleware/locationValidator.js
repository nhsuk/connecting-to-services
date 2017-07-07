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

  const validationResult = locationValidator(location);

  // eslint-disable-next-line no-param-reassign
  res.locals.location = validationResult.alteredLocation;

  if (validationResult.errorMessage) {
    log.info({ locationValidationResponse: { location } }, 'Non-English postcode');
    // eslint-disable-next-line no-param-reassign
    res.locals.errorMessage = validationResult.errorMessage;
    setLocationLabel(res, location);
    renderer.findHelp(req, res);
  } else {
    next();
  }
}

function renderNoResultsPage(req, res) {
  /* eslint-disable no-param-reassign */
  res.locals.nearbyServices = [];
  res.locals.openServices = [];
  /* eslint-enable no-param-reassign*/
  renderer.results(req, res);
}

function validateLocation(req, res, next) {
  const location = res.locals.location;

  if (isNotEnglishLocation(location)) {
    log.info({ req: { location } }, 'Non-English location');
    renderNoResultsPage(req, res);
  } else {
    validateEnglishLocation(req, res, next);
  }
}

module.exports = validateLocation;
