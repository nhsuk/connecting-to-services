const cache = require('memory-cache');
const chai = require('chai');
const pharmacies = require('../../../app/lib/getPharmacies');
const AssertionError = require('assert').AssertionError;
const moment = require('moment');

delete require.cache[require.resolve('../../../config/loadData')];
process.env.PHARMACY_LIST_PATH = '../test/resources/org_api_responses/pharmacy-list';
const loadData = require('../../../config/loadData');

const expect = chai.expect;

describe('Nearby', () => {
  let geo = [];
  const searchPoint = { latitude: 53.797431921096, longitude: -1.55275457242333 };
  const remoteSearchPoint = { latitude: 49.9126167297363, longitude: -6.30890274047852 };

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

    it('should get the number of unique nearby open services requested, ordered by distance',
      () => {
        const requestedNumberOfOpenResults = 4;
        const results =
          pharmacies
          .nearby(remoteSearchPoint, geo, { open: requestedNumberOfOpenResults })
          .openServices;

        expect(results.length).to.be.equal(requestedNumberOfOpenResults);

        const identifiers = [];
        let previousDistance = 0;

        results.forEach((result) => {
          const identifier = result.identifier;
          expect(identifiers.includes(identifier))
            .to.be.equal(false, `${identifier} is contained in the list of results already`);
          identifiers.push(identifier);

          expect(result.isOpen).to.be.equal(true);
          expect(result.distanceInMiles).to.be.at.least(previousDistance);
          previousDistance = result.distanceInMiles;
        });
      });

    it('should get the number of unique nearby services requested, ordered by distance', () => {
      const requestedNumberOfResults = 51;
      const results =
        pharmacies
        .nearby(remoteSearchPoint, geo, { nearby: requestedNumberOfResults })
        .nearbyServices;

      expect(results.length).to.be.equal(requestedNumberOfResults);

      const identifiers = [];
      let previousDistance = 0;

      results.forEach((result) => {
        const identifier = result.identifier;
        expect(identifiers.includes(identifier))
          .to.be.equal(false, `${identifier} is contained in the list of results already`);
        identifiers.push(identifier);

        expect(result.distanceInMiles).to.be.at.least(previousDistance);
        previousDistance = result.distanceInMiles;
      });
    });

    it('should return the nearest obj first', () => {
      const nearestIdentifier = 'FFP17';

      const results = pharmacies.nearby(searchPoint, geo).nearbyServices;

      expect(results[0].identifier).to.be.equal(nearestIdentifier);
    });

    it('should return obj with 3 open orgs', () => {
      const results = pharmacies.nearby(searchPoint, geo).openServices;

      expect(results.length).is.equal(3);
    });

    it('should return the opening times message and open state', () => {
      const alwaysOpenOrg = {
        latitude: searchPoint.latitude,
        longitude: searchPoint.longitude,
        openingTimes: {
          general: {
            monday: [{ opens: '00:00', closes: '23:59' }],
            tuesday: [{ opens: '00:00', closes: '23:59' }],
            wednesday: [{ opens: '00:00', closes: '23:59' }],
            thursday: [{ opens: '00:00', closes: '23:59' }],
            friday: [{ opens: '00:00', closes: '23:59' }],
            saturday: [{ opens: '00:00', closes: '23:59' }],
            sunday: [{ opens: '00:00', closes: '23:59' }],
          },
        },
      };
      function nearbyStub() { return [alwaysOpenOrg]; }
      const oneOpenOrgGeo = { nearBy: nearbyStub };

      const results = pharmacies.nearby(searchPoint, oneOpenOrgGeo).openServices;

      expect(results[0].isOpen).to.be.equal(true);
      expect(results[0].openingTimesMessage).to.not.be.equal('Call for opening times');
      expect(results[0].openingTimesMessage).to.be.a('string');
    });

    it('should use alterations opening times', () => {
      const nowDate = moment().format('YYYY-MM-DD');
      const alterations = {};
      alterations[nowDate] = [{ opens: '00:00', closes: '23:59' }];

      const orgWithAlterations = {
        latitude: searchPoint.latitude,
        longitude: searchPoint.longitude,
        openingTimes: {
          general: {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
          },
          alterations,
        },
      };

      function nearbyStub() { return [orgWithAlterations]; }
      const oneOrgGeo = { nearBy: nearbyStub };

      const results = pharmacies.nearby(searchPoint, oneOrgGeo).openServices;

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

    it('should throw an exception when nearby limit is not a number', () => {
      expect(() => {
        pharmacies.nearby(
          { latitude: 50.01, longitude: -1.23 },
          { nearBy: () => {} },
          { nearby: 'a' });
      }).to.throw(AssertionError, 'nearby limit must be a number');
    });

    it('should throw an exception when nearby limit is less than 0', () => {
      expect(() => {
        pharmacies.nearby(
          { latitude: 50.01, longitude: -1.23 },
          { nearBy: () => {} },
          { nearby: -1 });
      }).to.throw(AssertionError, 'nearby limit must be at least 1');
    });

    it('should throw an exception when open limit is not a number', () => {
      expect(() => {
        pharmacies.nearby(
          { latitude: 50.01, longitude: -1.23 },
          { nearBy: () => {} },
          { open: 'open' });
      }).to.throw(AssertionError, 'open limit must be a number');
    });

    it('should throw an exception when open limit is less than 0', () => {
      expect(() => {
        pharmacies.nearby(
          { latitude: 50.01, longitude: -1.23 },
          { nearBy: () => {} },
          { open: -1 });
      }).to.throw(AssertionError, 'open limit must be at least 1');
    });
  });
});
