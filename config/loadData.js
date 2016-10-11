const cache = require('memory-cache');
const Geo = require('geo-nearby');

const pharmacyListPath = process.env.PHARMACY_LIST_PATH || '../data/pharmacy-list';
const orgs = require(pharmacyListPath);

console.log(`Loaded data from ${pharmacyListPath}`);

function loadData() {
  console.time('project orgs');
  const mappedOrgs =
    orgs.filter((item) => {
      if (item.location) {
        /* eslint-disable no-param-reassign */
        item.longitude = item.location.coordinates[0];
        item.latitude = item.location.coordinates[1];
        /* eslint-enable no-param-reassign */
        return true;
      }
      console.log(`No location found for: ${item.identifier}`);
      return false;
    });
  console.timeEnd('project orgs');

  console.time('createCompactSet');
  const dataset =
    Geo.createCompactSet(mappedOrgs, { id: 'identifier', lat: 'latitude', lon: 'longitude' });
  console.timeEnd('createCompactSet');

  console.time('create Geo');
  const geo = new Geo(dataset, { sorted: true });
  console.timeEnd('create Geo');

  cache.put('geo', geo);
  cache.put('orgs', orgs);
}

module.exports = loadData;