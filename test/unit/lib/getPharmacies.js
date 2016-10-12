const cache = require('memory-cache');
const chai = require('chai');
const pharmacies = require('../../../app/lib/getPharmacies');
const loadData = require('../../../config/loadData');

const expect = chai.expect;

describe('Nearby', () => {
  let geo = [];
  let orgs = [];
  const searchPoint = { latitude: 52.537452697753906, longitude: -1.3636761903762817 };

  beforeEach('load data', () => {
    cache.clear();
    // load data into the cache using the load data module as there might be
    // stuff going on in it that we don't want to replicate in the tests
    loadData();
    geo = cache.get('geo');
    orgs = cache.get('orgs');
  });

  afterEach('clear all content from the cache', () => {
    cache.clear();
  });

  describe('happy path', () => {
    it('should get 10 nearby pharmacies, ordered by distance', () => {
      const results = pharmacies.nearby(searchPoint, geo, orgs);

      // eslint-disable-next-line no-unused-expressions
      expect(results).is.not.null;
      expect(results.length).to.be.equal(10);

      let previousDistance = 0;
      results.forEach((result) => {
        expect(result.distanceInMiles).to.be.at.least(previousDistance);
        previousDistance = result.distanceInMiles;
      });
    });
  });
});
