const handleReverseGeocodeError = require('./handleReverseGeocodeError');
const locate = require('./locate');
const routeHelper = require('../middleware/routeHelper');

async function reverseGeocode(req, res, next) {
  const result =
    await locate.byLatLon(req.query.latitude, req.query.longitude)
      .catch(error => handleReverseGeocodeError(error, next));
  if (!result) {
    routeHelper.renderNoResultsPage(null, res);
  } else if (result.country === 'England') {
    next();
  } else {
    // TODO: render no results page - possibly with some country specific messaging
    routeHelper.renderNoResultsPage(null, res);
  }
}

module.exports = reverseGeocode;
