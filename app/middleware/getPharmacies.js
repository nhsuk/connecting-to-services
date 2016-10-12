const cache = require('memory-cache');
const pharmacies = require('../lib/getPharmacies');

function getPharmacies(req, res, next) {
  // TODO: Make sure the args are not null in the cache
  const searchPoint = res.locals.coordinates;
  const orgs = cache.get('orgs');
  const geo = cache.get('geo');

  const nearbyServices = pharmacies.nearby(searchPoint, geo, orgs);

  // eslint-disable-next-line no-param-reassign
  res.locals.nearbyServices = nearbyServices;
  next();
}

module.exports = getPharmacies;
