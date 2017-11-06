const log = require('../lib/logger');
const renderer = require('./renderer');
const skipLatLongLookup = require('./skipLatLongLookup');
const isPostcode = require('../lib/isPostcode');
const messages = require('../lib/messages');
const isNotEnglishLocation = require('../lib/isNotEnglishLocation');
const locationValidator = require('../lib/locationValidator');
const performPlaceSearch = require('./performPlaceSearch');
const removeNonAlphabeticAndWhitespace = require('../lib/stringUtils').removeNonAlphabeticAndWhitespace;

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

function validatePlaceLocation(req, res, next, location) {
  const safeString = removeNonAlphabeticAndWhitespace(location);
  if (safeString) {
    res.locals.location = safeString;
    performPlaceSearch(req, res, next);
  } else {
    renderFindHelpPage(req, res, location, 'No location entered', messages.emptyPostcodeMessage());
  }
}
function renderNoResultsPage(req, res) {
  res.locals.nearbyServices = [];
  res.locals.openServices = [];
  renderer.results(req, res);
}

function validateLocation(req, res, next) {
  if (skipLatLongLookup(res)) {
    next();
  } else {
    const location = res.locals.location && res.locals.location.trim();
    if (!location) {
      renderFindHelpPage(req, res, location, 'No location entered', messages.emptyPostcodeMessage());
    } else if (!isPostcode(location)) {
      validatePlaceLocation(req, res, next, location);
    } else if (isNotEnglishLocation(location)) {
      log.info({ req: { location } }, 'Non-English location');
      renderNoResultsPage(req, res);
    } else {
      validateEnglishLocation(req, res, next);
    }
  }
}

module.exports = validateLocation;
