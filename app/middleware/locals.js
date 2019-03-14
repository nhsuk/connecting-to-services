const completeOriginalUrl = require('../lib/completeOriginalUrl');
const countryHelper = require('../lib/countryHelper');
const displayOpenResults = require('../lib/displayOpenResults');
const digitalData = require('../lib/digitalData');
const getDisplayLocation = require('../lib/getDisplayLocation');
const pageTitles = require('../lib/pageTitles');
const resultsPageAltUrl = require('../lib/resultsPageAltUrl');

module.exports = config => (req, res, next) => {
  res.locals.ASSETS_URL = req.app.locals.ASSETS_URL;
  res.locals.SITE_ROOT = req.app.locals.SITE_ROOT;

  res.locals.DISABLE_GOOGLE_SEARCH = config.disableGoogleSearch;

  res.locals.ADOBE_TRACKING_URL = config.analytics.adobeTrackingUrl;
  res.locals.GOOGLE_ANALYTICS_TRACKING_ID = config.analytics.googleAnalyticsId;
  res.locals.HOTJAR_ANALYTICS_TRACKING_ID = config.analytics.hotjarId;

  res.locals.digitalData = digitalData(req);
  res.locals.completeOriginalUrl = completeOriginalUrl(req);
  res.locals.coordinates = {
    latitude: req.query.latitude,
    longitude: req.query.longitude,
  };
  res.locals.displayOpenResults = displayOpenResults(req);
  res.locals.location = req.query.location;
  res.locals.locationLabel = 'Enter a town, city or postcode in England';
  res.locals.req_location = req.query.location;
  res.locals.resultsPageAltUrl = resultsPageAltUrl(req);

  res.locals.getDisplayLocation = () => getDisplayLocation(res.locals.location);
  res.locals.getFindHelpPageTitle = () => pageTitles
    .search(res.locals.req_location, res.locals.errorMessage);
  res.locals.getPlacesPageTitle = () => pageTitles
    .disambiguation(res.locals.location, res.locals.places);
  res.locals.getResultsPageTitle = () => pageTitles
    .results(res.locals.location, res.locals.services);
  res.locals.hasNoCountries = () => countryHelper.hasNoCountries(res.locals.countries);
  res.locals.showCountry = country => countryHelper.showCountry(res.locals.countries, country);

  next();
};
