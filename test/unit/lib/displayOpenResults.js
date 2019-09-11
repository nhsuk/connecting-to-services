const chai = require('chai');
const moment = require('moment');

const bankHolidayDates = require('../../../data/bankHolidayDates');
const displayOpenResults = require('../../../app/lib/displayOpenResults');

const expect = chai.expect;

const testDateTimes = {
  afterBusinessHours: moment('2018-03-14T18:00:00'),
  bankHoliday: moment(bankHolidayDates[0]).hour(12),
  endOfBusinessHours: moment('2018-03-14T17:59:59'),
  middayDuringWeek: moment('2018-03-14T12:00:00'),
  startOfBusinessHours: moment('2018-03-14T08:00:00'),
  weekendDay: moment('2018-03-01T22:00:00'),
};

describe('displayOpenResults', () => {
  describe('on a weekday', () => {
    describe('during business hours', () => {
      beforeEach(() => {
        process.env.DATETIME = testDateTimes.middayDuringWeek;
      });

      it('should return true when query contains open and it is true', () => {
        const result = displayOpenResults({ query: { open: 'true' } });

        expect(result).to.equal(true);
      });

      it('should return true when query contains open and it is TRUE', () => {
        const result = displayOpenResults({ query: { open: 'TRUE' } });

        expect(result).to.equal(true);
      });

      it('should return false when query does not contain open', () => {
        const result = displayOpenResults({ query: { } });

        expect(result).to.equal(false);
      });

      it('should return false when query contains open and it is not equal to true', () => {
        const result = displayOpenResults({ query: { open: 'NOT true' } });

        expect(result).to.equal(false);
      });
    });

    describe('at start of business hours', () => {
      beforeEach(() => {
        process.env.DATETIME = testDateTimes.startOfBusinessHours;
      });

      it('should return true when query contains open and it is true', () => {
        const result = displayOpenResults({ query: { open: 'true' } });

        expect(result).to.equal(true);
      });

      it('should return false when query does not contain open', () => {
        const result = displayOpenResults({ query: { } });

        expect(result).to.equal(false);
      });
    });

    describe('at end of business hours', () => {
      beforeEach(() => {
        process.env.DATETIME = testDateTimes.endOfBusinessHours;
      });

      it('should return true when query contains open and it is true', () => {
        const result = displayOpenResults({ query: { open: 'true' } });

        expect(result).to.equal(true);
      });

      it('should return false when query does not contain open', () => {
        const result = displayOpenResults({ query: { } });

        expect(result).to.equal(false);
      });
    });

    describe('before business hours', () => {
      beforeEach(() => {
        const beforeBusinessHours = moment('2018-03-14T07:59:59');
        process.env.DATETIME = beforeBusinessHours;
      });

      it('should return true when query contains open and it is true', () => {
        const result = displayOpenResults({ query: { open: 'true' } });

        expect(result).to.equal(true);
      });

      it('should return true when query does not contain open', () => {
        const result = displayOpenResults({ query: { } });

        expect(result).to.equal(true);
      });

      it('should return false when query contains open and it is not equal to true', () => {
        const result = displayOpenResults({ query: { open: 'NOT true' } });

        expect(result).to.equal(false);
      });
    });

    describe('after business hours', () => {
      beforeEach(() => {
        process.env.DATETIME = testDateTimes.afterBusinessHours;
      });

      it('should return true when query contains open and it is true', () => {
        const result = displayOpenResults({ query: { open: 'true' } });

        expect(result).to.equal(true);
      });

      it('should return true when query does not contain open', () => {
        const result = displayOpenResults({ query: { } });

        expect(result).to.equal(true);
      });

      it('should return false when query contains open and it is not equal to true', () => {
        const result = displayOpenResults({ query: { open: 'NOT true' } });

        expect(result).to.equal(false);
      });
    });
  });

  describe('on a weekend day', () => {
    beforeEach(() => {
      process.env.DATETIME = testDateTimes.weekendDay;
    });

    it('should return true when query contains open and it is true', () => {
      const result = displayOpenResults({ query: { open: 'true' } });

      expect(result).to.equal(true);
    });

    it('should return true when query does not contain open', () => {
      const result = displayOpenResults({ query: { } });

      expect(result).to.equal(true);
    });

    it('should return false when query contains open and it is not equal to true', () => {
      const result = displayOpenResults({ query: { open: 'NOT true' } });

      expect(result).to.equal(false);
    });
  });

  describe('on a bank holiday', () => {
    beforeEach(() => {
      process.env.DATETIME = testDateTimes.bankHoliday;
    });

    it('should return true when query contains open and it is true', () => {
      const result = displayOpenResults({ query: { open: 'true' } });

      expect(result).to.equal(true);
    });

    it('should return true when query does not contain open', () => {
      const result = displayOpenResults({ query: { } });

      expect(result).to.equal(true);
    });

    it('should return false when query contains open and it is not equal to true', () => {
      const result = displayOpenResults({ query: { open: 'NOT true' } });

      expect(result).to.equal(false);
    });
  });
});
