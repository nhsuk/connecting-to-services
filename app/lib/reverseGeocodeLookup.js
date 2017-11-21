const handleReverseGeocodeError = require('./handleReverseGeocodeError');
const locate = require('./locate');
const routeHelper = require('../middleware/routeHelper');
const promCounters = require('./promCounters');

async function reverseGeocode(req, res, next) {
  promCounters.myLocationSearches.inc(1);
  const result =
    await locate.byLatLon(req.query.latitude, req.query.longitude)
      .catch(error => handleReverseGeocodeError(error, next));
  if (!result) {
    promCounters.outOfAreaMyLocationSearches.inc(1);
    routeHelper.renderNoResultsPage(null, res);
  } else if (result.country === 'England') {
    promCounters.englishMyLocationSearches.inc(1);
    next();
  } else {
    promCounters.knownButNotEnglishMyLocationSearches.inc(1);
    // TODO: render no results page - possibly with some country specific messaging
    routeHelper.renderNoResultsPage(null, res);
  }
}

module.exports = reverseGeocode;
