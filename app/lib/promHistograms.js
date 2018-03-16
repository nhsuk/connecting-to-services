const promClient = require('./promBundle').promClient;
const buckets = require('./constants').promHistogramBuckets;

module.exports = {
  getNearbyServices: new promClient.Histogram({ buckets, help: 'Duration histogram of request to nearby-services-api', name: 'get_nearby_services' }),
  getPlace: new promClient.Histogram({ buckets, help: 'Duration histogram of request to postcodes.io for place lookup', name: 'get_postcodes_io_place' }),
  getPostcode: new promClient.Histogram({ buckets, help: 'Duration histogram of request to postcodes.io for postcode lookup', name: 'get_postcodes_io_postcode' }),
  getReverseGeocode: new promClient.Histogram({ buckets, help: 'Duration histogram of request to postcodes.io for reverse geocode lookup', name: 'get_postcodes_io_reverse_geocode' }),
};
