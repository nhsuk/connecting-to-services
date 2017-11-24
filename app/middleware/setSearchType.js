const constants = require('../lib/constants');
const isPostcode = require('../lib/isPostcode');

function setSearchType(req, res, next) {
  const location = res.locals.location;

  if (location) {
    if (location === constants.yourLocation) {
      res.locals.searchType = constants.yourLocationSearch;
    } else if (isPostcode(location)) {
      res.locals.searchType = constants.postcodeSearch;
    } else {
      res.locals.searchType = constants.placeSearch;
    }
  }
  next();
}

module.exports = setSearchType;
