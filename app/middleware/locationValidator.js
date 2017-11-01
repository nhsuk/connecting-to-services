const log = require('../lib/logger');
const renderer = require('../middleware/renderer');
const isNotPostcode = require('../lib/isNotPostcode');
const messages = require('../lib/messages');
const isNotEnglishLocation = require('../lib/isNotEnglishLocation');
const locationValidator = require('../lib/locationValidator');

function setLocationLabel(res, location) {
  if (location) {
    res.locals.locationLabel = 'Enter a valid postcode';
  }
}

function renderFindHelpPage(req, res, location, message, errorMessage) {
  log.info({ locationValidationResponse: { location } }, message);
  res.locals.errorMessage = errorMessage;
  setLocationLabel(res, location);
  renderer.findHelp(req, res);
}

function validateEnglishLocation(req, res, next) {
  const location = res.locals.location;
  const validationResult = locationValidator(location);
  res.locals.location = validationResult.alteredLocation;
  if (validationResult.errorMessage) {
    renderFindHelpPage(req, res, location, 'Non-English postcode', validationResult.errorMessage);
  } else {
    next();
  }
}

function renderNoResultsPage(req, res) {
  res.locals.nearbyServices = [];
  res.locals.openServices = [];
  renderer.results(req, res);
}

function sanitiseString(string) {
  return string && string.replace(/[^a-z]/gmi, ' ').replace(/\s\s+/g, ' ').trim();
}
function validateLocation(req, res, next) {
  const location = res.locals.location && res.locals.location.trim();
  if (!location) {
    renderFindHelpPage(req, res, location, 'No location entered', messages.emptyPostcodeMessage());
  } else if (isNotPostcode(location)) {
    const safeString = sanitiseString(location);
    if (safeString) {
      res.redirect(`places?location=${sanitiseString(location)}`);
    } else {
      renderFindHelpPage(req, res, location, 'No location entered', messages.emptyPostcodeMessage());
    }
  } else if (isNotEnglishLocation(location)) {
    log.info({ req: { location } }, 'Non-English location');
    renderNoResultsPage(req, res);
  } else {
    validateEnglishLocation(req, res, next);
  }
}

module.exports = validateLocation;
