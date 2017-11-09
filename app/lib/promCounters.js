const promClient = require('./promBundle').promClient;

module.exports = {
  applicationStarts: new promClient.Counter({ name: 'app_starts', help: 'The number of times the application has been started' }),
  errorPageViews: new promClient.Counter({ name: 'error_page_views', help: 'The number of error page views' }),
  placeSearches: new promClient.Counter({ name: 'place_searches', help: 'The number of place searches' }),
  postcodeSearches: new promClient.Counter({ name: 'postcode_searches', help: 'The number of postcode searches' }),
  zeroPlaceResultsViews: new promClient.Counter({ name: 'zero_place_results_views', help: 'The number of zero place results page views' }),
  zeroPostcodeResultsViews: new promClient.Counter({ name: 'zero_postcode_results_views', help: 'The number of zero postcode results page views' }),
  zeroPharmacyResultsViews: new promClient.Counter({ name: 'zero_pharmacy_results_views', help: 'The number of zero pharmacy results page views' }),
  placeDisambiguationViews: new promClient.Counter({ name: 'place_disambiguation_views', help: 'The number of place disambiguation page views' }),
};
