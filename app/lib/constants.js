module.exports = {
  ASSETS_URL: 'https://assets.nhs.uk',
  SITE_ROOT: '/find-a-pharmacy',
  api: {
    nearbyResultsCount: 10,
    openResultsCount: 10,
    paths: {
      nearby: 'nearby',
      open: 'open',
    },
  },
  businessHours: {
    end: {
      hour: 18,
      minute: 0,
    },
    start: {
      hour: 8,
      minute: 0,
    },
  },
  dayInMilliseconds: 24 * 60 * 60 * 1000,
  daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  daysOfWeekOrderedForUi: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  placeSearch: 'place',
  postcodeSearch: 'postcode',
  promHistogramBuckets: [0.01, 0.05, 0.1, 0.2, 0.3, 0.5, 1, 1.5, 5, 10],
  yourLocation: 'your location',
  yourLocationSearch: 'location',
};
