const getOtherCountriesMessage = require('../lib/getOtherCountriesMessage');

module.exports = config =>
  (req, res, next) => {
    res.locals.GOOGLE_ANALYTICS_TRACKING_ID = config.googleAnalyticsId;
    res.locals.WEBTRENDS_ANALYTICS_TRACKING_ID = config.webtrendsId;
    res.locals.HOTJAR_ANALYTICS_TRACKING_ID = config.hotjarId;
    res.locals.SITE_ROOT = req.app.locals.SITE_ROOT;
    res.locals.getDisplayLocation = () => res.locals.location && res.locals.location.split(',')[0];
    res.locals.getCountryMessage = function getMessage() {
      return res.locals.countries && getOtherCountriesMessage(res.locals.countries);
    };
    next();
  };
