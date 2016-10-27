const debugLoadData = require('../app/lib/debuggers').loadData;
const cache = require('memory-cache');
const Geo = require('geo-nearby');
const geohash = require('ngeohash');

const pharmacyListPath = process.env.PHARMACY_LIST_PATH || '../data/pharmacy-list';
const orgs = require(pharmacyListPath);

debugLoadData(`Loaded data from ${pharmacyListPath}`);

function loadData() {
  const mappedOrgs =
    orgs.filter((item) => {
      if (item.location) {
        /* eslint-disable no-param-reassign */
        item.longitude = item.location.coordinates[0];
        item.latitude = item.location.coordinates[1];
        item.g = geohash.encode_int(item.latitude, item.longitude);
        /* eslint-enable no-param-reassign */
        return true;
      }
      debugLoadData(`No location found for: ${item.identifier}`);
      return false;
    });

  const geo = new Geo(mappedOrgs);

  cache.put('geo', geo);
  cache.put('orgs', orgs);
}

module.exports = loadData;
