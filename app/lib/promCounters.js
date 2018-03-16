const promClient = require('./promBundle').promClient;

module.exports = {
  applicationStarts: new promClient.Counter({ help: 'The number of times the application has been started', name: 'app_starts' }),
  englishMyLocationSearches: new promClient.Counter({ help: 'The number of my location searches in England', name: 'english_my_location_searches' }),
  errorPageViews: new promClient.Counter({ help: 'The number of error page views', name: 'error_page_views' }),
  knownButNotEnglishMyLocationSearches: new promClient.Counter({ help: 'The number of my location searches in an area that is known but is not in England', name: 'known_but_not_english_my_location_searches' }),
  outOfAreaMyLocationSearches: new promClient.Counter({ help: 'The number of my location searches in an unsupported area', name: 'out_of_area_my_location_searches' }),
  placeDisambiguationViews: new promClient.Counter({ help: 'The number of place disambiguation page views', name: 'place_disambiguation_views' }),
  resultsCheck: new promClient.Counter({ help: 'The number of checks against the results page', name: 'results_check' }),
  searchCheck: new promClient.Counter({ help: 'The number of checks against the search page', name: 'search_check' }),
  zeroPharmacyResultsViews: new promClient.Counter({ help: 'The number of zero pharmacy results page views', name: 'zero_pharmacy_results_views' }),
  zeroPlaceResultsViews: new promClient.Counter({ help: 'The number of zero place results page views', name: 'zero_place_results_views' }),
  zeroPostcodeResultsViews: new promClient.Counter({ help: 'The number of zero postcode results page views', name: 'zero_postcode_results_views' }),
};
