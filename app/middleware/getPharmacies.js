const cache = require('memory-cache');
const pharmacies = require('../lib/getPharmacies');

function getPharmacies(req, res, next) {
  const searchPoint = res.locals.coordinates;
  const geo = cache.get('geo');

  const nearby = pharmacies.nearby(searchPoint, geo);

  /* eslint-disable no-param-reassign*/
  res.locals.nearbyServices = nearby.nearbyServices;
  res.locals.openServices = nearby.openServices;
  /* eslint-enable no-param-reassign*/
  next();
}

module.exports = getPharmacies;
