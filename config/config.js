const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);

module.exports = {
  analytics: {
    adobeTrackingUrl: process.env.ADOBE_TRACKING_URL,
    hotjarId: process.env.HOTJAR_ANALYTICS_TRACKING_ID,
  },
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
  cookiebot: {
    scriptUrl: process.env.COOKIEBOT_SCRIPT_URL || 'https://assets.nhs.uk/scripts/cookie-consent.js',
  },
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  root: rootPath,
  search: {
    apiKey: process.env.SEARCH_API_KEY,
    host: process.env.SEARCH_API_HOST || 'api.nhs.uk',
    maxNumberOfResults: process.env.SEARCH_MAX_RESULTS || 10,
    version: process.env.SEARCH_API_VERSION || '1',
  },
  timezone: 'Europe/London',
};
