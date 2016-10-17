const cache = require('memory-cache');
const pharmacies = require('../lib/getPharmacies');

function getPharmacies(req, res, next) {
  const searchPoint = res.locals.coordinates;
  const geo = cache.get('geo');

  const nearbyServices = pharmacies.nearby(searchPoint, geo);

  // eslint-disable-next-line no-param-reassign
  res.locals.nearbyServices = nearbyServices;
  next();
}

module.exports = getPharmacies;
