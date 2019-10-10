const chai = require('chai');
const VError = require('verror').VError;

const queryBuilder = require('../../../app/lib/queryBuilder');
const queryTypes = require('../../../app/lib/constants').queryTypes;

const expect = chai.expect;

describe('queryBuilder', () => {
  const searchOrigin = { latitude: 53.234149, longitude: 5.024449 };
  const expectedPharamcyFilter = "OrganisationTypeID eq 'PHA' and OrganisationSubType eq 'Community Pharmacy'";
  describe('nearby and open', () => {
    let query;
    afterEach('reset dateTime override', () => {
      delete process.env.DATETIME;
    });
    beforeEach('set dateTime override', () => {
      process.env.DATETIME = '2019-10-03 09:00';
      query = queryBuilder(searchOrigin, { queryType: queryTypes.openNearby });
    });
    it('should return filter', () => {
      const expectedFilter = ` ( ${expectedPharamcyFilter} ) and ( OpeningTimesV2/any(time: time/Weekday eq 'Thursday' and time/OpeningTimeType eq 'General' and time/OffsetOpeningTime le 540 and time/OffsetClosingTime ge 540) and not OpeningTimesV2/any(time: search.in(time/OpeningTimeType, 'Additional, General') and time/AdditionalOpeningDate eq 'Oct 3 2019') ) or ( OpeningTimesV2/any(time: search.in(time/OpeningTimeType, 'Additional, General') and time/OffsetOpeningTime le 540 and time/OffsetClosingTime ge 540 and time/AdditionalOpeningDate eq 'Oct 3 2019') )`;

      expect(query.filter).to.equal(expectedFilter);
    });
    it('should return orderby', () => {
      expect(query.orderby).to.equal(`geo.distance(Geocode, geography'POINT(${searchOrigin.longitude} ${searchOrigin.latitude})')`);
    });
    it('should return select', () => {
      expect(query.select).to.not.be.empty;
    });
  });
  describe('nearby', () => {
    it('should return filter', () => {
      const query = queryBuilder(searchOrigin, { queryType: queryTypes.nearby });
      expect(query).to.not.be.undefined;
      expect(query.filter).to.equal(expectedPharamcyFilter);
      expect(query.orderby).to.not.be.undefined;
      expect(query.top).to.equal(10);
    });
    it('should return orderby', () => {
      const query = queryBuilder(searchOrigin, { queryType: queryTypes.nearby });
      expect(query).to.not.be.undefined;
      expect(query.orderby).to.equal(`geo.distance(Geocode, geography'POINT(${searchOrigin.longitude} ${searchOrigin.latitude})')`);
    });
    it('should return select', () => {
      const query = queryBuilder(searchOrigin, { queryType: queryTypes.nearby });
      expect(query.select).to.not.be.empty;
    });
    it('should return count', () => {
      const query = queryBuilder(searchOrigin, { queryType: queryTypes.nearby });
      expect(query.count).to.be.true;
    });
    it('should return default top', () => {
      const query = queryBuilder(searchOrigin, { queryType: queryTypes.nearby });
      expect(query.top).to.equal(10);
    });
    it('should return specified top', () => {
      const query = queryBuilder(searchOrigin, {
        queryType: queryTypes.nearby,
        size: 15,
      });
      expect(query.top).to.equal(15);
    });
  });
  describe('error', () => {
    it('should throw for unknown queryType', () => {
      expect(() => queryBuilder(searchOrigin, { queryType: 'unknown' })).to.throw(VError, 'Unknown queryType: unknown');
    });
  });
});
