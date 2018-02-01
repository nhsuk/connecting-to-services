const promClient = require('./promBundle').promClient;
const buckets = require('./constants').promHistogramBuckets;

module.exports = {
  getNearbyServices: new promClient.Histogram({ name: 'get_nearby_services', help: 'Duration histogram of request to nearby-services-api', buckets }),
  getPostcode: new promClient.Histogram({ name: 'get_postcodes_io_postcode', help: 'Duration histogram of request to postcodes.io for postcode lookup', buckets }),
  getPlace: new promClient.Histogram({ name: 'get_postcodes_io_place', help: 'Duration histogram of request to postcodes.io for place lookup', buckets }),
  getReverseGeocode: new promClient.Histogram({ name: 'get_postcodes_io_reverse_geocode', help: 'Duration histogram of request to postcodes.io for reverse geocode lookup', buckets }),
};
