const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);

module.exports = {
  app: {
    name: 'connecting-to-services',
  },
  businessHours: {
    end: {
      hour: process.env.BUSINESS_HOURS_END_HOUR || 18,
      minute: process.env.BUSINESS_HOURS_END_MINUTE || 0,
    },
    start: {
      hour: process.env.BUSINESS_HOURS_START_HOUR || 8,
      minute: process.env.BUSINESS_HOURS_START_MINUTE || 0,
    },
  },
  disableGoogleSearch: process.env.DISABLE_GOOGLE_SEARCH === 'true',
  env: process.env.NODE_ENV || 'development',
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
  headerApiUrl: 'https://refdata-api.azurewebsites.net/api/fullheadermenu',
  hotjarId: process.env.HOTJAR_ANALYTICS_TRACKING_ID,
  port: process.env.PORT || 3000,
  root: rootPath,
  webtrendsId: process.env.WEBTRENDS_ANALYTICS_TRACKING_ID,
};
