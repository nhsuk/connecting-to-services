const mapLink = require('../lib/mapLink');

function results(req, res, next) {
  const location = res.locals.location;
  res.locals.nearbyServices = mapLink.addUrl(location, res.locals.nearbyServices);
  res.locals.openServices = mapLink.addUrl(location, res.locals.openServices);

  next();
}

module.exports = {
  results,
};
