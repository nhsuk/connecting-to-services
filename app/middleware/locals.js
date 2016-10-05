module.exports = (config) =>
  (req, res, next) => {
    /* eslint-disable no-param-reassign */
    res.locals.GOOGLE_ANALYTICS_TRACKING_ID = config.googleAnalyticsId;
    res.locals.WEBTRENDS_TRACKING_ID = config.webtrendsId;
    res.locals.HOTJAR_TRACKING_ID = config.hotjarId;
    /* eslint-enable no-param-reassign */

    next();
  };
