const routeHelper = require('./routeHelper');
const skipLatLongLookup = require('./skipLatLongLookup');
const isPostcode = require('../lib/isPostcode');
const messages = require('../lib/messages');
const postcodeValidator = require('../lib/postcodeValidator');
const performPlaceSearch = require('./performPlaceSearch');
const stringUtils = require('../lib/stringUtils');

function validatePostcode(req, res, next) {
  const location = res.locals.location;
  const validationResult = postcodeValidator(location);
  res.locals.location = validationResult.alteredLocation;
  if (validationResult.errorMessage) {
    routeHelper.renderFindHelpPage(req, res, 'Invalid postcode', validationResult.errorMessage);
  } else {
    next();
  }
}

function validatePlace(req, res, next) {
  const safeString = stringUtils.removeNonAlphanumericAndDoubleSpaces(res.locals.location);
  if (safeString) {
    res.locals.location = safeString;
    performPlaceSearch(req, res, next);
  } else {
    routeHelper.renderFindHelpPage(req, res, 'No location entered', messages.emptyPostcodeMessage());
  }
}

function validateLocation(req, res, next) {
  if (skipLatLongLookup(res)) {
    res.locals.location = stringUtils.removeNonAddressCharacters(res.locals.location);
    next();
  } else {
    res.locals.location = res.locals.location && res.locals.location.trim();
    if (!res.locals.location) {
      routeHelper.renderFindHelpPage(req, res, 'No location entered', messages.emptyPostcodeMessage());
    } else if (!isPostcode(res.locals.location)) {
      validatePlace(req, res, next);
    } else {
      validatePostcode(req, res, next);
    }
  }
}

module.exports = validateLocation;
