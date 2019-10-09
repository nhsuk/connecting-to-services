const log = require('../lib/logger');
const { zeroPlaceResultsViews } = require('../lib/promCounters');

function logZeroResults(req, res, next) {
  const { locals: { location } } = res;

  if (res.locals.services.length === 0) {
    log.warn({ location }, `No results were found for ${location}`);
    zeroPlaceResultsViews.inc(1);
  }

  next();
}

module.exports = logZeroResults;
