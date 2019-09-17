const chai = require('chai');
const Moment = require('moment');
const getOpeningTimesMessage = require('../../../app/lib/getOpeningTimesMessage');

const expect = chai.expect;
const aSunday = new Moment('2016-07-24T00:00:00+00:00');

function getMoment(day, hours, minutes, timeZone) {
  const dayNumber = Moment
    .weekdays()
    .map(d => d.toLowerCase())
    .indexOf(day);
  const moment = new Moment(aSunday).tz(timeZone);
  moment.add(dayNumber, 'days').hours(hours).minutes(minutes);
  return moment;
}

describe('getOpeningTimesMessage()', () => {
  describe('status closed', () => {
    it('opening tomorrow should return \'closed until x tomorrow\' message', () => {
      const status = {
        isOpen: false,
        moment: getMoment('tuesday', 18, 0, 'Europe/London'),
        nextOpen: getMoment('wednesday', 9, 30, 'Europe/London'),
      };

      expect(getOpeningTimesMessage(status))
        .to.equal('Closed until 9:30am tomorrow');
    });

    it('opening beyond tomorrow should return \'closed until x Friday\' message', () => {
      const status = {
        isOpen: false,
        moment: getMoment('tuesday', 18, 0, 'Europe/London'),
        nextOpen: getMoment('friday', 9, 30, 'Europe/London'),
      };

      expect(getOpeningTimesMessage(status))
        .to.equal('Closed until 9:30am Friday');
    });

    it('closed until should omit minutes if on the hour in \'closed until x tomorrow\' message', () => {
      const status = {
        isOpen: false,
        moment: getMoment('tuesday', 18, 0, 'Europe/London'),
        nextOpen: getMoment('wednesday', 9, 0, 'Europe/London'),
      };

      expect(getOpeningTimesMessage(status))
        .to.equal('Closed until 9am tomorrow');
    });

    it('opening in 2 hours should return \'closed until x today\' message', () => {
      const status = {
        isOpen: false,
        moment: getMoment('tuesday', 7, 0, 'Europe/London'),
        nextOpen: getMoment('tuesday', 9, 30, 'Europe/London'),
      };
      expect(getOpeningTimesMessage(status)).to.equal('Closed until 9:30am today');
    });

    it('opening in should omit minutes if on the hour in \'closed until x today\' message', () => {
      const status = {
        isOpen: false,
        moment: getMoment('tuesday', 7, 0, 'Europe/London'),
        nextOpen: getMoment('tuesday', 9, 0, 'Europe/London'),
      };
      expect(getOpeningTimesMessage(status)).to.equal('Closed until 9am today');
    });

    it('opening in less than 60 minutes should return \'opening in x minutes\' message', () => {
      const status = {
        isOpen: false,
        moment: getMoment('tuesday', 8, 30, 'Europe/London'),
        nextOpen: getMoment('tuesday', 9, 0, 'Europe/London'),
      };
      expect(getOpeningTimesMessage(status)).to.equal('Open in 30 minutes');
    });

    it('opening in less than a minute should return \'opening in 1 minute\' message', () => {
      const status = {
        isOpen: false,
        moment: getMoment('tuesday', 8, 59, 'Europe/London').add(30, 'seconds'),
        nextOpen: getMoment('tuesday', 9, 0, 'Europe/London'),
      };
      expect(getOpeningTimesMessage(status)).to.equal('Open in 1 minute');
    });

    it('next opening time unknown should return a \'call for times\' message', () => {
      const status = {
        isOpen: false,
        moment: getMoment('tuesday', 8, 30, 'Europe/London'),
      };
      expect(getOpeningTimesMessage(status)).to.equal('Call for opening times');
    });
  });

  describe('status open', () => {
    it('next closing time unknown should return a \'call for times\' message', () => {
      const status = {
        isOpen: true,
        moment: getMoment('tuesday', 15, 30, 'Europe/London'),
      };
      expect(getOpeningTimesMessage(status)).to.equal('Call for opening times');
    });

    it('closing in 2 hours should return \'open until x today\' message', () => {
      const status = {
        isOpen: true,
        moment: getMoment('tuesday', 15, 30, 'Europe/London'),
        nextClosed: getMoment('tuesday', 17, 30, 'Europe/London'),
      };
      expect(getOpeningTimesMessage(status)).to.equal('Open until 5:30pm today');
    });

    it('closing in 2 hours should omit minutes if time is on the hour in \'open until x today\' message', () => {
      const status = {
        isOpen: true,
        moment: getMoment('tuesday', 16, 0, 'Europe/London'),
        nextClosed: getMoment('tuesday', 18, 0, 'Europe/London'),
      };
      expect(getOpeningTimesMessage(status)).to.equal('Open until 6pm today');
    });

    it('closing in less than 60 minutes should return \'open until x today\' message', () => {
      const status = {
        isOpen: true,
        moment: getMoment('tuesday', 17, 0, 'Europe/London'),
        nextClosed: getMoment('tuesday', 17, 30, 'Europe/London'),
      };
      expect(getOpeningTimesMessage(status)).to.equal('Open until 5:30pm today');
    });

    it('closing at 00:00 should return \'Open until midnight\' message', () => {
      const status = {
        isOpen: true,
        moment: getMoment('tuesday', 9, 30, 'Europe/London'),
        nextClosed: getMoment('wednesday', 0, 0, 'Europe/London'),
      };
      expect(getOpeningTimesMessage(status)).to.equal('Open until midnight');
    });

    it('closing at 23:59 should return \'Open until midnight\' message', () => {
      const status = {
        isOpen: true,
        moment: getMoment('tuesday', 9, 30, 'Europe/London'),
        nextClosed: getMoment('tuesday', 23, 59, 'Europe/London'),
      };
      expect(getOpeningTimesMessage(status)).to.equal('Open until midnight');
    });

    it('closing at 23:59 tomorrow should return \'Open until midnight Tuesday\' message', () => {
      const status = {
        isOpen: true,
        moment: getMoment('monday', 9, 30, 'Europe/London'),
        nextClosed: getMoment('tuesday', 23, 59, 'Europe/London'),
      };
      expect(getOpeningTimesMessage(status)).to.equal('Open until midnight tomorrow');
    });
  });

  describe('status undefined', () => {
    it('Open/closed status unknown should return a \'call for times\' message', () => {
      const status = {};
      expect(getOpeningTimesMessage(status)).to.equal('Call for opening times');
    });
  });
});
