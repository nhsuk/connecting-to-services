const mapLink = require('../lib/mapLink');
const choicesOverview = require('../lib/choicesOverview');

function results(req, res, next) {
  const location = res.locals.location;
  res.locals.nearbyServices = mapLink.addUrl(location, res.locals.nearbyServices);
  res.locals.openServices = mapLink.addUrl(location, res.locals.openServices);

  res.locals.nearbyServices = choicesOverview.choicesOverviewUrl(res.locals.nearbyServices);
  res.locals.openServices = choicesOverview.choicesOverviewUrl(res.locals.openServices);

  next();
}

module.exports = {
  results,
};
