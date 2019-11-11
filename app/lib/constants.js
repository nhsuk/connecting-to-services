module.exports = {
  api: {
    nearbyResultsCount: 10,
    openResultsCount: 10,
    paths: {
      nearby: 'nearby',
      open: 'open',
    },
  },
  app: {
    description: 'Find an open pharmacy near you on the NHS website. Check your local pharmacy\'s opening times, and find your nearest late night, 24-hour or out-of-hours chemist.',
    locale: 'en_GB',
    siteName: 'nhs.uk',
    title: 'Find a pharmacy',
    twitter: {
      card: 'summary_large_image',
      creator: '@nhsuk',
      site: '@nhsuk',
    },
  },
  assetsUrl: 'https://assets.nhs.uk',
  daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  daysOfWeekOrderedForUi: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  daysOfWorkingWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  placeSearch: 'place',
  postcodeSearch: 'postcode',
  promHistogramBuckets: [0.01, 0.05, 0.1, 0.2, 0.3, 0.5, 1, 1.5, 5, 10],
  queryTypes: {
    nearby: 'nearby',
    openNearby: 'openNearby',
  },
  siteRoot: '/service-search/find-a-pharmacy',
  yourLocation: 'your location',
  yourLocationSearch: 'location',
};
