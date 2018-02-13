const getSearchType = require('../lib/getSearchType');

function setSearchType(req, res, next) {
  res.locals.searchType = getSearchType(res.locals.location, res.locals.coordinates);
  next();
}

module.exports = setSearchType;
