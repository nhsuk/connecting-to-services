const handleReverseGeocodeError = require('./handleReverseGeocodeError');
const locate = require('./locate');
const promCounters = require('./promCounters');
const routeHelper = require('../middleware/routeHelper');

async function reverseGeocode(req, res, next) {
  try {
    const result = await locate.byLatLon(req.query.latitude, req.query.longitude);
    if (!result) {
      promCounters.outOfAreaMyLocationSearches.inc(1);
      routeHelper.renderNoLocationResultsPage(res);
    } else {
      // eslint-disable-next-line prefer-destructuring
      res.locals.countries = result.countries;
      if (result.country === 'England') {
        promCounters.englishMyLocationSearches.inc(1);
        next();
      } else {
        promCounters.knownButNotEnglishMyLocationSearches.inc(1);
        routeHelper.renderNoLocationResultsPage(res);
      }
    }
  } catch (error) {
    handleReverseGeocodeError(error, next);
  }
}

module.exports = reverseGeocode;
