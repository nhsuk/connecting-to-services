const log = require('../lib/logger');
const renderer = require('../middleware/renderer');
const isNotEnglishLocation = require('../lib/isNotEnglishLocation');
const locationValidator = require('../lib/locationValidator');

function setLocationLabel(res, location) {
  if (location) {
    res.locals.locationLabel = 'Enter a valid postcode';
  }
}

function validateEnglishLocation(req, res, next) {
  const location = res.locals.location;

  const validationResult = locationValidator(location);

  res.locals.location = validationResult.alteredLocation;

  if (validationResult.errorMessage) {
    log.info({ locationValidationResponse: { location } }, 'Non-English postcode');
    res.locals.errorMessage = validationResult.errorMessage;
    setLocationLabel(res, location);
    renderer.findHelp(req, res);
  } else {
    next();
  }
}

function renderNoResultsPage(req, res) {
  res.locals.nearbyServices = [];
  res.locals.openServices = [];
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
