const Verror = require('verror');
const AssertionError = require('assert').AssertionError;
const openingTimesParser = require('../../../app/lib/openingTimesParser');
const getSampleResponse = require('../../resources/getSampleResponse');
const weekdays = require('moment').weekdays().map(d => d.toLowerCase());
const chai = require('chai');

const expect = chai.expect;

describe('openingTimesParser', () => {
  describe('happy path', () => {
    it('should get multiple slot opening times from syndication response', () => {
      const syndicationXml = getSampleResponse('syndication_responses/pharmacy_overview.xml');
      const openingTimes = openingTimesParser('reception', syndicationXml);
      expect(openingTimes).to.have.keys(weekdays);
      expect(openingTimes.monday.times).to.eql([
        { fromTime: '08:00', toTime: '13:00' },
        { fromTime: '13:00', toTime: '19:30' },
      ]);
      expect(openingTimes.friday.times).to.eql([
        { fromTime: '08:00', toTime: '13:00' },
        { fromTime: '13:00', toTime: '18:00' },
      ]);
      expect(openingTimes.sunday.times).to.eql(['Closed']);
    });

    it('should get single slot opening times from syndication response', () => {
      const syndicationXml =
        getSampleResponse('syndication_responses/pharmacy_overview_single_time_slot.xml');
      const openingTimes = openingTimesParser('reception', syndicationXml);
      expect(openingTimes).to.have.keys(weekdays);
      expect(openingTimes.monday.times).to.eql([
        { fromTime: '08:00', toTime: '19:30' },
      ]);
      expect(openingTimes.friday.times).to.eql([
        { fromTime: '08:00', toTime: '19:30' },
      ]);
      expect(openingTimes.sunday.times).to.eql(['Closed']);
    });

    it('should get single type opening times from syndication response', () => {
      const syndicationXml = getSampleResponse('syndication_responses/pharmacy_opening_times.xml');
      const openingTimes = openingTimesParser('general', syndicationXml);
      expect(openingTimes).to.have.keys(weekdays);
      expect(openingTimes.monday.times).to.eql([
        { fromTime: '09:00', toTime: '17:30' },
      ]);
      expect(openingTimes.friday.times).to.eql([
        { fromTime: '09:00', toTime: '17:30' },
      ]);
      expect(openingTimes.sunday.times).to.eql(['Closed']);
    });

    it('should handle missing opening times', () => {
      const syndicationXml =
        getSampleResponse('syndication_responses/pharmacy_no_opening_times.xml');
      const openingTimes = openingTimesParser('general', syndicationXml);
      expect(openingTimes).to.eql({});
    });
  });
  describe('error handling', () => {
    it('should throw exception when arguments are missing', () => {
      expect(() => { openingTimesParser(); })
        .to.throw(
          AssertionError,
          'parameter \'openingTimesType\' undefined/empty');
      expect(() => { openingTimesParser('reception'); })
        .to.throw(
          AssertionError,
          'parameter \'xml\' undefined/empty');
    });

    it('should throw exception when arguments are of the wrong type', () => {
      expect(() => { openingTimesParser(1, 2); })
        .to.throw(
          AssertionError,
          'parameter \'openingTimesType\' must be a string');
      expect(() => { openingTimesParser('reception', 2); })
        .to.throw(
          AssertionError,
          'parameter \'xml\' must be a string');
    });

    it('should throw exception when passed invalid XML', () => {
      const syndicationXml = '<invalidxmldocument>';
      expect(() => { openingTimesParser('reception', syndicationXml); })
        .to.throw(Verror,
          'Unable to parse opening times XML: Unclosed root tag');
    });

    it('should throw exception when passed an unknown opening times type', () => {
      const syndicationXml = getSampleResponse('syndication_responses/pharmacy_overview.xml');
      expect(() => { openingTimesParser('unknown', syndicationXml); })
        .to.throw(
          Verror,
          'Unable to get \'unknown\' opening times from xml: ' +
          'Cannot read property \'daysOfWeek\' of undefined');
    });

    it('should throw exception when passed an empty opening times type', () => {
      const syndicationXml = 'not empty';
      expect(() => { openingTimesParser('', syndicationXml); })
        .to.throw(
          AssertionError,
          'parameter \'openingTimesType\' undefined/empty');
    });

    it('should throw exception when passed an empty xml string', () => {
      const syndicationXml = '';
      expect(() => { openingTimesParser('reception', syndicationXml); })
        .to.throw(
          AssertionError,
          'parameter \'xml\' undefined/empty');
    });

    it('should throw exception when xml does not contain organisation opening times.', () => {
      const syndicationXml = '<xml></xml>';
      expect(() => { openingTimesParser('reception', syndicationXml); })
        .to.throw(
          Verror,
          'Unable to get \'reception\' opening times from xml: ' +
          'Cannot read property \'entry\' of undefined');
    });
  });
});
