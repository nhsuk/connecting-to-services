const getDisplayLocation = require('../lib/getDisplayLocation');
const countryHelper = require('../lib/countryHelper');
const pageTitles = require('../lib/pageTitles');
const backLinkUtils = require('../lib/backLinkUtils');
const completeOriginalUrl = require('../lib/completeOriginalUrl');
const resultsPageAltUrl = require('../lib/resultsPageAltUrl');
const displayOpenResults = require('../lib/displayOpenResults');

module.exports = config =>
  (req, res, next) => {
    // Env vars
    res.locals.GOOGLE_ANALYTICS_TRACKING_ID = config.googleAnalyticsId;
    res.locals.WEBTRENDS_ANALYTICS_TRACKING_ID = config.webtrendsId;
    res.locals.HOTJAR_ANALYTICS_TRACKING_ID = config.hotjarId;
    res.locals.DISABLE_GOOGLE_SEARCH = config.disableGoogleSearch;
    res.locals.SITE_ROOT = req.app.locals.SITE_ROOT;
    res.locals.ASSETS_URL = req.app.locals.ASSETS_URL;

    // Local vars
    const backLink = backLinkUtils(req);
    const location = req.query.location;
    res.locals.backLink = {
      href: backLink.url,
      text: backLink.text,
    };
    res.locals.completeOriginalUrl = completeOriginalUrl(req);
    res.locals.coordinates = {
      latitude: req.query.latitude,
      longitude: req.query.longitude,
    };
    res.locals.displayOpenResults = displayOpenResults(req);
    res.locals.location = location;
    res.locals.locationLabel = 'Enter a town, city or postcode in England';
    res.locals.req_location = location;
    res.locals.resultsPageAltUrl = resultsPageAltUrl(req);

    // View functions
    res.locals.getDisplayLocation =
      () => getDisplayLocation(res.locals.location);
    res.locals.getFindHelpPageTitle =
      () => pageTitles.search(res.locals.req_location, res.locals.errorMessage);
    res.locals.getPlacesPageTitle =
      () => pageTitles.disambiguation(res.locals.location, res.locals.places);
    res.locals.getResultsPageTitle =
      () => pageTitles.results(res.locals.location, res.locals.services);
    res.locals.hasNoCountries =
      () => countryHelper.hasNoCountries(res.locals.countries);
    res.locals.showCountry =
      country => countryHelper.showCountry(res.locals.countries, country);

    next();
  };
