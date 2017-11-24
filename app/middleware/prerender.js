const mapLink = require('../lib/mapLink');
const choicesOverview = require('../lib/choicesOverview');

function results(req, res, next) {
  const searchCriteria = {
    coordinates: res.locals.coordinates,
    searchTerm: res.locals.location,
    searchType: res.locals.searchType,
  };

  res.locals.nearbyServices = mapLink.addUrl(searchCriteria, res.locals.nearbyServices);
  res.locals.openServices = mapLink.addUrl(searchCriteria, res.locals.openServices);

  res.locals.nearbyServices = choicesOverview.addUrl(res.locals.nearbyServices);
  res.locals.openServices = choicesOverview.addUrl(res.locals.openServices);

  next();
}

module.exports = {
  results,
};
