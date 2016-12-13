const log = require('../lib/logger');
const mapLink = require('../lib/mapLink');

function results(req, res, next) {
  log.info('prerender-start');
  const context = res.locals.context;
  const location = res.locals.location;

  /* eslint-disable no-param-reassign */
  res.locals.nearbyServices = mapLink.addUrl(location, res.locals.nearbyServices);
  res.locals.openServices = mapLink.addUrl(location, res.locals.openServices);
  res.locals.context = context;
  /* eslint-enable no-param-reassign */

  log.info('prerender-end');
  next();
}

module.exports = {
  results,
};
