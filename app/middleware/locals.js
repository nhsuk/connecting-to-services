const getDisplayLocation = require('../lib/getDisplayLocation');
const countryHelper = require('../lib/countryHelper');
const pageTitles = require('../lib/pageTitles');

module.exports = config =>
  (req, res, next) => {
    res.locals.GOOGLE_ANALYTICS_TRACKING_ID = config.googleAnalyticsId;
    res.locals.WEBTRENDS_ANALYTICS_TRACKING_ID = config.webtrendsId;
    res.locals.HOTJAR_ANALYTICS_TRACKING_ID = config.hotjarId;
    res.locals.SITE_ROOT = req.app.locals.SITE_ROOT;
    res.locals.ASSETS_URL = req.app.locals.ASSETS_URL;
    res.locals.getDisplayLocation = () => getDisplayLocation(res.locals.location);
    res.locals.showCountry = country => countryHelper.showCountry(res.locals.countries, country);
    res.locals.hasNoCountries = () => countryHelper.hasNoCountries(res.locals.countries);
    res.locals.getFindHelpPageTitle =
      () => pageTitles.search(res.locals.req_location, res.locals.errorMessage);
    res.locals.getPlacesPageTitle =
      () => pageTitles.disambiguation(res.locals.location, res.locals.places);
    res.locals.getResultsPageTitle =
      () => pageTitles.results(
        res.locals.location,
        res.locals.openServices,
        res.locals.nearbyServices
      );

    next();
  };
