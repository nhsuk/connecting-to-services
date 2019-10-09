const chai = require('chai');

const bankHolidayDates = require('../../../data/bankHolidayDates');
const displayOpenResults = require('../../../app/lib/displayOpenResults');

const { expect } = chai;

const testDateTimes = {
  afterBusinessHours: '2018-03-14 18:00',
  bankHoliday: `${bankHolidayDates[0]} 12:00`,
  beforeBusinessHours: '2018-03-14 07:59',
  endOfBusinessHours: '2018-03-14 17:59',
  middayDuringWeek: '2018-03-14 12:00',
  startOfBusinessHours: '2018-03-14 08:00',
  weekendDay: '2018-03-01 22:00',
};

describe('displayOpenResults', () => {
  describe('on a weekday', () => {
    describe('during business hours', () => {
      beforeEach(() => {
        ({ middayDuringWeek: process.env.DATETIME } = testDateTimes);
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
        ({ startOfBusinessHours: process.env.DATETIME } = testDateTimes);
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
        ({ endOfBusinessHours: process.env.DATETIME } = testDateTimes);
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
        const { beforeBusinessHours } = testDateTimes;
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
        ({ afterBusinessHours: process.env.DATETIME } = testDateTimes);
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
      ({ weekendDay: process.env.DATETIME } = testDateTimes);
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
      ({ bankHoliday: process.env.DATETIME } = testDateTimes);
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
