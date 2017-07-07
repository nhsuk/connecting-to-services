const mapLink = require('../lib/mapLink');

function results(req, res, next) {
  const location = res.locals.location;

  /* eslint-disable no-param-reassign */
  res.locals.nearbyServices = mapLink.addUrl(location, res.locals.nearbyServices);
  res.locals.openServices = mapLink.addUrl(location, res.locals.openServices);
  /* eslint-enable no-param-reassign */

  next();
}

module.exports = {
  results,
};
