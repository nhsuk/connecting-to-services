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
  const searchPoint = { latitude: 50.08545303344, longitude: -1.576518416404 };

  describe('happy path', () => {
    beforeEach('load data', () => {
      cache.clear();
      // load data into the cache using the load data module as there might be
      // stuff going on in it that we don't want to replicate in the tests
      loadData();
      geo = cache.get('geo');
    });

    afterEach('clear all content from the cache', () => {
      cache.clear();
    });

    it('should return an object with nearby and open services', () => {
      const results = pharmacies.nearby(searchPoint, geo);

      expect(results).is.not.equal(undefined);
      expect(results.nearbyServices).is.not.equal(undefined);
      expect(results.openServices).is.not.equal(undefined);
    });

    it('should get 10 nearby pharmacies by default, ordered by distance', () => {
      const results = pharmacies.nearby(searchPoint, geo).nearbyServices;

      expect(results.length).to.be.equal(10);

      let previousDistance = 0;
      results.forEach((result) => {
        expect(result.distanceInMiles).to.be.at.least(previousDistance);
        previousDistance = result.distanceInMiles;
      });
    });

    it('should get the number of results requested, ordered by distance', () => {
      const requestedNumberOfResults = 5;
      const results = pharmacies.nearby(searchPoint, geo, requestedNumberOfResults).nearbyServices;

      expect(results.length).to.be.equal(requestedNumberOfResults);

      let previousDistance = 0;
      results.forEach((result) => {
        expect(result.distanceInMiles).to.be.at.least(previousDistance);
        previousDistance = result.distanceInMiles;
      });
    });

    it('should return the nearest obj first', () => {
      const nearestIdentifier = 'FA040';

      const results = pharmacies.nearby(searchPoint, geo).nearbyServices;

      expect(results[0].identifier).to.be.equal(nearestIdentifier);
    });

    it('should return obj with 3 open orgs', () => {
      const results = pharmacies.nearby(searchPoint, geo).openServices;

      expect(results.length).is.equal(3);
    });

    it('should return the opening times message and open state', () => {
      const results = pharmacies.nearby(searchPoint, geo).openServices;

      expect(results[0].isOpen).to.be.equal(true);
      expect(results[0].openingTimesMessage).to.not.be.equal('Call for opening times');
      expect(results[0].openingTimesMessage).to.be.a('string');
    });

    it('should say call for opening times when the org does not have any opening times', () => {
      const orgWithNoOpeningTimes = {
        latitude: searchPoint.latitude,
        longitude: searchPoint.longitude,
      };
      function nearbyStub() { return [orgWithNoOpeningTimes]; }
      const oneOrgGeo = { nearBy: nearbyStub };
      const results = pharmacies.nearby(searchPoint, oneOrgGeo).nearbyServices;

      expect(results.length).to.be.equal(1);
      expect(results[0].isOpen).to.be.equal(false);
      expect(results[0].openingTimesMessage).to.be.equal('Call for opening times');
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
