const cache = require('memory-cache');
const chai = require('chai');
const pharmacies = require('../../../app/lib/getPharmacies');
const AssertionError = require('assert').AssertionError;

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

  describe('error handling', () => {
    it('should throw an exception when searchPoint is null', () => {
      expect(() => { pharmacies.nearby(); })
        .to.throw(
            AssertionError,
            'searchPoint can not be null');
    });

    it('should throw exception when searchPoint does not contain longitude', () => {
      expect(() => { pharmacies.nearby({ latitude: 50.123456789 }); })
        .to.throw(AssertionError,
            'searchPoint must contain a property named longitude');
    });
    it('should throw exception when searchPoint does not contain latitude', () => {
      expect(() => { pharmacies.nearby({ longitude: -1.123456789 }); })
        .to.throw(
            AssertionError,
            'searchPoint must contain a property named latitude');
    });

    it('should throw an exception when geo is null', () => {
      expect(() => { pharmacies.nearby({ latitude: 50.01, longitude: -1.23 }); })
        .to.throw(
            AssertionError,
            'geo can not be null');
    });

    it('should throw an exception when geo does not contain a nearby function', () => {
      expect(() => { pharmacies.nearby({ latitude: 50.01, longitude: -1.23 }, {}); })
        .to.throw(
            AssertionError,
            'geo must contain a nearBy function');
    });
  });
});
