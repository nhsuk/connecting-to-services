const constants = require('../lib/constants');
const routeHelper = require('./routeHelper');
const skipLatLongLookup = require('./skipLatLongLookup');
const isPostcode = require('../lib/isPostcode');
const messages = require('../lib/messages');
const englishPostcodeValidator = require('../lib/englishPostcodeValidator');
const performPlaceSearch = require('./performPlaceSearch');
const stringUtils = require('../lib/stringUtils');

function validateEnglishPostcode(req, res, next) {
  const location = res.locals.location;
  const validationResult = englishPostcodeValidator(location);
  res.locals.location = validationResult.alteredLocation;
  if (validationResult.errorMessage) {
    routeHelper.renderFindHelpPage(req, res, 'Non-English postcode', validationResult.errorMessage);
  } else {
    next();
  }
}

function validatePlaceLocation(req, res, next) {
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
    if (res.locals.location === constants.yourLocation) {
      res.locals.searchType = constants.yourLocationSearch;
    }
    next();
  } else {
    res.locals.location = res.locals.location && res.locals.location.trim();
    if (!res.locals.location) {
      routeHelper.renderFindHelpPage(req, res, 'No location entered', messages.emptyPostcodeMessage());
    } else if (!isPostcode(res.locals.location)) {
      res.locals.searchType = constants.placeSearch;
      validatePlaceLocation(req, res, next);
    } else {
      res.locals.searchType = constants.postcodeSearch;
      validateEnglishPostcode(req, res, next);
    }
  }
}

module.exports = validateLocation;
