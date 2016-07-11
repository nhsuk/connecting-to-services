const chai = require('chai');
const expect = chai.expect;
const Verror = require('verror');
const AssertionError = require('assert').AssertionError;
const gpOpeningTimesParser = require('../../app/lib/gpOpeningTimesParser');
const getSampleResponse = require('./lib/getSampleResponse');
const daysOfTheWeek = require('../../app/lib/constants').daysOfTheWeek;

describe('gpOpeningTimesParser', () => {
  it('should get GP multiple slot opening times from syndication response', () => {
    const syndicationXml = getSampleResponse('gp_overview');
    const gpOpeningTimes = gpOpeningTimesParser('reception', syndicationXml);
    expect(gpOpeningTimes).to.have.keys(daysOfTheWeek);
    expect(gpOpeningTimes.monday.times).to.eql([
      { fromTime: '08:00', toTime: '13:00' },
      { fromTime: '13:00', toTime: '19:30' },
    ]);
    expect(gpOpeningTimes.friday.times).to.eql([
      { fromTime: '08:00', toTime: '13:00' },
      { fromTime: '13:00', toTime: '18:00' },
    ]);
    expect(gpOpeningTimes.sunday.times).to.eql(['Closed']);
  });
  it('should get GP single slot opening times from syndication response', () => {
    const syndicationXml = getSampleResponse('gp_overview_single_time_slot');
    const gpOpeningTimes = gpOpeningTimesParser('reception', syndicationXml);
    expect(gpOpeningTimes).to.have.keys(daysOfTheWeek);
    expect(gpOpeningTimes.monday.times).to.eql([
      { fromTime: '08:00', toTime: '19:30' },
    ]);
    expect(gpOpeningTimes.friday.times).to.eql([
      { fromTime: '08:00', toTime: '19:30' },
    ]);
    expect(gpOpeningTimes.sunday.times).to.eql(['Closed']);
  });
  it('should throw exception when arguments are missing', () => {
    expect(() => { gpOpeningTimesParser(); })
      .to.throw(
        AssertionError,
        'parameter \'openingTimesType\' undefined/empty');
    expect(() => { gpOpeningTimesParser('reception'); })
      .to.throw(
        AssertionError,
        'parameter \'xml\' undefined/empty');
  });
  it('should throw exception when arguments are of the wrong type', () => {
    expect(() => { gpOpeningTimesParser(1, 2); })
      .to.throw(
        AssertionError,
        'parameter \'openingTimesType\' must be a string');
    expect(() => { gpOpeningTimesParser('reception', 2); })
      .to.throw(
        AssertionError,
        'parameter \'xml\' must be a string');
  });
  it('should throw exception when passed invalid XML', () => {
    const syndicationXml = '<invalidxmldocument>';
    expect(() => { gpOpeningTimesParser('reception', syndicationXml); })
      .to.throw(Verror,
      'Unable to parse GP opening times XML: Unclosed root tag');
  });
  it('should throw exception when passed an unknown opening times type', () => {
    const syndicationXml = getSampleResponse('gp_overview');
    expect(() => { gpOpeningTimesParser('unknown', syndicationXml); })
      .to.throw(
        Verror,
        'Unable to get \'unknown\' opening times from xml: ' +
        'Cannot read property \'daysOfWeek\' of undefined');
  });
  it('should throw exception when passed an empty opening times type', () => {
    const syndicationXml = 'not empty';
    expect(() => { gpOpeningTimesParser('', syndicationXml); })
      .to.throw(
        AssertionError,
        'parameter \'openingTimesType\' undefined/empty');
  });
  it('should throw exception when passed an empty xml string', () => {
    const syndicationXml = '';
    expect(() => { gpOpeningTimesParser('reception', syndicationXml); })
      .to.throw(
        AssertionError,
        'parameter \'xml\' undefined/empty');
  });
  it('should throw exception when xml does not contain organisation opening times.', () => {
    const syndicationXml = '<xml></xml>';
    expect(() => { gpOpeningTimesParser('reception', syndicationXml); })
      .to.throw(
        Verror,
        'Unable to get \'reception\' opening times from xml: ' +
        'Cannot read property \'entry\' of undefined');
  });
});
