const log = require('../app/lib/logger');
const cache = require('memory-cache');
const Geo = require('geo-nearby');
const geohash = require('ngeohash');

const pharmacyListPath = process.env.PHARMACY_LIST_PATH || '../data/pharmacy-list';
// eslint-disable-next-line import/no-dynamic-require
const orgs = require(pharmacyListPath);

log.info(`Loaded data from ${pharmacyListPath}`);

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
      log.warn(`No location found for: ${item.identifier}`);
      return false;
    });

  const geo = new Geo(mappedOrgs);

  cache.put('geo', geo);
  cache.put('orgs', orgs);
  log.info(`${orgs.length} orgs available for searching`);
}

module.exports = loadData;
