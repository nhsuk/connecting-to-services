const chai = require('chai');
const expect = chai.expect;
const gpOpeningTimesParser = require('../../app/utilities/gpOpeningTimesParser');
const getSampleResponse = require('./getSampleResponse');

const daysOfTheWeek =
  ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

describe('Utilities', () => {
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
  });
});
