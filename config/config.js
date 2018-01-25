const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);

module.exports = {
  app: {
    name: 'connecting-to-services',
  },
  env: process.env.NODE_ENV || 'development',
  root: rootPath,
  port: process.env.PORT || 3000,
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
  webtrendsId: process.env.WEBTRENDS_ANALYTICS_TRACKING_ID,
  hotjarId: process.env.HOTJAR_ANALYTICS_TRACKING_ID,
  disableGoogleSearch: process.env.DISABLE_GOOGLE_SEARCH === 'true',
  headerApiUrl: 'https://refdata-api.azurewebsites.net/api/fullheadermenu',
};
