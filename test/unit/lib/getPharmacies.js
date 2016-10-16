const cache = require('memory-cache');
const chai = require('chai');
const pharmacies = require('../../../app/lib/getPharmacies');

delete require.cache[require.resolve('../../../config/loadData')];
process.env.PHARMACY_LIST_PATH = '../test/resources/org_api_responses/pharmacy-list';
const loadData = require('../../../config/loadData');

const expect = chai.expect;

describe('Nearby', () => {
  let geo = [];
  let orgs = [];
  const searchPoint = { latitude: 50.085453033447266, longitude: -1.5765184164047241 };

  describe('happy path', () => {
    beforeEach('load data', () => {
      cache.clear();
      // load data into the cache using the load data module as there might be
      // stuff going on in it that we don't want to replicate in the tests
      loadData();
      geo = cache.get('geo');
    });

    afterEach('clear all content from the cache', () => {
      orgs = cache.get('orgs');
      cache.clear();
    });

    it('should get 10 nearby pharmacies by default, ordered by distance', () => {
      const results = pharmacies.nearby(searchPoint, geo);

      expect(results).is.not.equal(null);
      expect(results.length).to.be.equal(10);

      let previousDistance = 0;
      results.forEach((result) => {
        expect(result.distanceInMiles).to.be.at.least(previousDistance);
        previousDistance = result.distanceInMiles;
      });
    });

    it('should get the number of results requested, ordered by distance', () => {
      const requestedNumberOfResults = 5;
      const results = pharmacies.nearby(searchPoint, geo, requestedNumberOfResults);

      expect(results).is.not.equal(null);
      expect(results.length).to.be.equal(requestedNumberOfResults);

      let previousDistance = 0;
      results.forEach((result) => {
        expect(result.distanceInMiles).to.be.at.least(previousDistance);
        previousDistance = result.distanceInMiles;
      });
    });

    it('should return obj with expected keys', () => {
      const results = pharmacies.nearby(searchPoint, geo);

      const expectedKeys = Object.keys(orgs[1]);
      expectedKeys.push('distanceInMiles');

      results.forEach((result) => {
        expect(result).to.have.keys(expectedKeys);
      });
    });

    it('should return the nearest obj first', () => {
      const nearestIdentifier = 'FA040';

      const results = pharmacies.nearby(searchPoint, geo);

      expect(results[0].identifier).to.be.equal(nearestIdentifier);
    });

    it('should return obj with open orgs', () => {
      // TODO:
    });
  });
});
