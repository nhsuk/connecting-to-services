function isCountry(countries, country) {
  return !countries || countries.length === 0 || countries.find(c => c === country);
}

function hasNoCountries(countries) {
  return !countries || countries.length === 0;
}

module.exports = config =>
  (req, res, next) => {
    res.locals.GOOGLE_ANALYTICS_TRACKING_ID = config.googleAnalyticsId;
    res.locals.WEBTRENDS_ANALYTICS_TRACKING_ID = config.webtrendsId;
    res.locals.HOTJAR_ANALYTICS_TRACKING_ID = config.hotjarId;
    res.locals.SITE_ROOT = req.app.locals.SITE_ROOT;
    res.locals.getDisplayLocation = () => res.locals.location && res.locals.location.split(',')[0];
    res.locals.isCountry = country => isCountry(res.locals.countries, country);
    res.locals.hasNoCountries = () => hasNoCountries(res.locals.countries);

    next();
  };
