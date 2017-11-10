const log = require('../lib/logger');
const zeroPlaceResultsViews = require('../lib/promCounters').zeroPlaceResultsViews;

function logZeroResults(req, res, next) {
  const location = res.locals.location;

  if (res.locals.nearbyServices.length === 0 && res.locals.openServices.length === 0) {
    log.warn({ location }, `No results were found for ${location}`);
    zeroPlaceResultsViews.inc(1);
  }

  next();
}

module.exports = logZeroResults;
