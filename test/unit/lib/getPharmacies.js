const cache = require('memory-cache');
const chai = require('chai');
const pharmacies = require('../../../app/lib/getPharmacies');

delete require.cache[require.resolve('../../../config/loadData')];
process.env.PHARMACY_LIST_PATH = '../test/resources/org_api_responses/10-pharmacies';
const loadData = require('../../../config/loadData');

const expect = chai.expect;

describe('Nearby', () => {
  let geo = [];
  let orgs = [];
  let results = {};
  const searchPoint = { latitude: 50.085453033447266, longitude: -5.315622806549072 };

  describe('happy path', () => {
    beforeEach('load data', () => {
      cache.clear();
      // load data into the cache using the load data module as there might be
      // stuff going on in it that we don't want to replicate in the tests
      loadData();
      geo = cache.get('geo');
      orgs = cache.get('orgs');
      results = pharmacies.nearby(searchPoint, geo, orgs);
    });

    afterEach('clear all content from the cache', () => {
      orgs = cache.get('orgs');
      cache.clear();
    });

    it('should get 10 nearby pharmacies, ordered by distance', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(results).is.not.null;
      expect(results.length).to.be.equal(10);

      let previousDistance = 0;
      results.forEach((result) => {
        expect(result.distanceInMiles).to.be.at.least(previousDistance);
        previousDistance = result.distanceInMiles;
      });
    });
    it('should return obj with expected keys', () => {
      const expectedKeys = Object.keys(orgs[1]);

      results.forEach((result) => {
        expect(result).to.have.keys(expectedKeys);
      });
    });
    it('should return the nearest obj first', () => {
      const nearestIdentifier = 'FYX99';

      expect(results[0].identifier).to.be.equal(nearestIdentifier);
    });
    it('should return obj with open orgs', () => {
      // TODO:
    });
  });
});
