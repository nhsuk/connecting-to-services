const constants = require('../lib/constants');
const log = require('../lib/logger');
const routeHelper = require('./routeHelper');
const skipLatLongLookup = require('./skipLatLongLookup');
const isPostcode = require('../lib/isPostcode');
const messages = require('../lib/messages');
const isNotEnglishPostcode = require('../lib/isNotEnglishPostcode');
const englishPostcodeValidator = require('../lib/englishPostcodeValidator');
const performPlaceSearch = require('./performPlaceSearch');
const stringUtils = require('../lib/stringUtils');

function validateEnglishPostcode(req, res, next) {
  const location = res.locals.location;
  const validationResult = englishPostcodeValidator(location);
  res.locals.location = validationResult.alteredLocation;
  if (validationResult.errorMessage) {
    routeHelper.renderFindHelpPage(req, res, location, 'Non-English postcode', validationResult.errorMessage);
  } else {
    next();
  }
}

function validatePlaceLocation(req, res, next, location) {
  const safeString = stringUtils.removeNonAlphabeticAndWhitespace(location);
  if (safeString) {
    res.locals.location = safeString;
    performPlaceSearch(req, res, next);
  } else {
    routeHelper.renderFindHelpPage(req, res, location, 'No location entered', messages.emptyPostcodeMessage());
  }
}

function validateLocation(req, res, next) {
  if (skipLatLongLookup(res)) {
    res.locals.location = stringUtils.removeNonAddressCharacters(res.locals.location);
    next();
  } else {
    const location = res.locals.location && res.locals.location.trim();
    if (!location) {
      routeHelper.renderFindHelpPage(req, res, location, 'No location entered', messages.emptyPostcodeMessage());
    } else if (!isPostcode(location)) {
      res.locals.searchType = constants.placeSearch;
      validatePlaceLocation(req, res, next, location);
    } else {
      res.locals.searchType = constants.postcodeSearch;
      if (isNotEnglishPostcode(location)) {
        log.info({ req: { location } }, 'Non-English location');
        routeHelper.renderNoResultsPage(req, res);
      } else {
        validateEnglishPostcode(req, res, next);
      }
    }
  }
}

module.exports = validateLocation;
