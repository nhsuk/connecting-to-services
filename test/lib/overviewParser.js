const Verror = require('verror');
const AssertionError = require('assert').AssertionError;
const overviewParser = require('../../lib/overviewParser');
const getSampleResponse = require('../test-lib/getSampleResponse');
const daysOfTheWeek = require('../../lib/constants').daysOfTheWeek;
const chai = require('chai');

const expect = chai.expect;

describe('overviewParser', () => {
  describe('happy path', () => {
    it('should get multiple slot opening times from syndication response', () => {
      const syndicationXml = getSampleResponse('org_overview');
      const openingTimes = overviewParser(syndicationXml).openingTimes;

      expect(openingTimes).to.have.keys(daysOfTheWeek);
      expect(openingTimes.tuesday.times).to.eql([
        { fromTime: '08:00', toTime: '12:00' },
        { fromTime: '13:00', toTime: '19:00' },
      ]);
      expect(openingTimes.wednesday.times).to.eql([
        { fromTime: '08:00', toTime: '12:00' },
        { fromTime: '14:00', toTime: '18:00' },
      ]);
      expect(openingTimes.sunday.times).to.eql(['Closed']);
    });

    it('should get single slot opening times from syndication response', () => {
      const syndicationXml = getSampleResponse('org_overview');
      const openingTimes = overviewParser(syndicationXml).openingTimes;
      expect(openingTimes).to.have.keys(daysOfTheWeek);
      expect(openingTimes.monday.times).to.eql([
        { fromTime: '08:00', toTime: '19:00' },
      ]);
      expect(openingTimes.friday.times).to.eql([
        { fromTime: '08:00', toTime: '19:00' },
      ]);
      expect(openingTimes.sunday.times).to.eql(['Closed']);
    });
  });

  describe('error handling', () => {
    it('should throw exception when arguments are missing', () => {
      expect(() => { overviewParser(); })
        .to.throw(
          AssertionError,
          'parameter \'xml\' undefined/empty');
    });
    it('should throw exception when passed invalid XML', () => {
      const syndicationXml = '<invalidxmldocument>';

      expect(() => { overviewParser(syndicationXml); })
        .to.throw(Verror,
          'Unable to parse overview XML: Unclosed root tag');
    });
    it('should throw exception when passed an empty xml string', () => {
      const syndicationXml = '';

      expect(() => { overviewParser(syndicationXml); })
        .to.throw(
          AssertionError,
          'parameter \'xml\' undefined/empty');
    });
    it('should throw exception when xml does not contain organisation opening times.', () => {
      const syndicationXml = getSampleResponse('overview_with_no_opening_times');
      const id = 'http://v1.syndication.nhschoices.nhs.uk/organisations/pharmacies/30037/overview?apikey=secret';

      expect(() => { overviewParser(syndicationXml); })
        .to.throw(
          Verror,
          `Unable to get general opening times from xml for '${id}': ` +
          'Cannot read property \'0\' of undefined');
    });
  });
});
