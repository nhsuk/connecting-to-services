const promClient = require('./promBundle').promClient;
const buckets = require('./constants').promHistogramBuckets;

module.exports = {
  getNearbyServices: new promClient.Histogram({ name: 'get_nearby_services', help: 'Duration histogram of request to nearby-services-api', buckets }),
};
