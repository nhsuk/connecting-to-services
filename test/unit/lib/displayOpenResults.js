const chai = require('chai');
const moment = require('moment');

const bankHolidayDates = require('../../../data/bankHolidayDates');
const displayOpenResults = require('../../../app/lib/displayOpenResults');

const expect = chai.expect;

describe('displayOpenResults', () => {
  describe('on a weekday', () => {
    describe('during business hours', () => {
      const middayDuringWeek = moment('2018-03-14T12:00:00');

      it('should return true when query contains open and it is true', () => {
        const result = displayOpenResults({ query: { open: 'true' } }, middayDuringWeek);

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
      const startOfBusinessHours = moment('2018-03-14T08:00:00');

      it('should return true when query contains open and it is true', () => {
        const result = displayOpenResults({ query: { open: 'true' } }, startOfBusinessHours);

        expect(result).to.equal(true);
      });

      it('should return false when query does not contain open', () => {
        const result = displayOpenResults({ query: { } }, startOfBusinessHours);

        expect(result).to.equal(false);
      });
    });

    describe('at end of business hours', () => {
      const endOfBusinessHours = moment('2018-03-14T17:59:59');

      it('should return true when query contains open and it is true', () => {
        const result = displayOpenResults({ query: { open: 'true' } }, endOfBusinessHours);

        expect(result).to.equal(true);
      });

      it('should return false when query does not contain open', () => {
        const result = displayOpenResults({ query: { } }, endOfBusinessHours);

        expect(result).to.equal(false);
      });
    });

    describe('before business hours', () => {
      const beforeBusinessHours = moment('2018-03-14T07:59:59');

      it('should return true when query contains open and it is true', () => {
        const result = displayOpenResults({ query: { open: 'true' } }, beforeBusinessHours);

        expect(result).to.equal(true);
      });

      it('should return true when query does not contain open', () => {
        const result = displayOpenResults({ query: { } }, beforeBusinessHours);

        expect(result).to.equal(true);
      });

      it('should return false when query contains open and it is not equal to true', () => {
        const result = displayOpenResults({ query: { open: 'NOT true' } }, beforeBusinessHours);

        expect(result).to.equal(false);
      });
    });

    describe('after business hours', () => {
      const afterBusinessHours = moment('2018-03-14T18:00:00');

      it('should return true when query contains open and it is true', () => {
        const result = displayOpenResults({ query: { open: 'true' } }, afterBusinessHours);

        expect(result).to.equal(true);
      });

      it('should return true when query does not contain open', () => {
        const result = displayOpenResults({ query: { } }, afterBusinessHours);

        expect(result).to.equal(true);
      });

      it('should return false when query contains open and it is not equal to true', () => {
        const result = displayOpenResults({ query: { open: 'NOT true' } }, afterBusinessHours);

        expect(result).to.equal(false);
      });
    });
  });

  describe('on a weekend day', () => {
    const weekendDay = moment('2018-03-03T12:00:00');

    it('should return true when query contains open and it is true', () => {
      const result = displayOpenResults({ query: { open: 'true' } }, weekendDay);

      expect(result).to.equal(true);
    });

    it('should return true when query does not contain open', () => {
      const result = displayOpenResults({ query: { } }, weekendDay);

      expect(result).to.equal(true);
    });

    it('should return false when query contains open and it is not equal to true', () => {
      const result = displayOpenResults({ query: { open: 'NOT true' } }, weekendDay);

      expect(result).to.equal(false);
    });
  });

  describe('on a bank holiday', () => {
    const bankHoliday = moment(bankHolidayDates[0]).hour(12);

    it('should return true when query contains open and it is true', () => {
      const result = displayOpenResults({ query: { open: 'true' } }, bankHoliday);

      expect(result).to.equal(true);
    });

    it('should return true when query does not contain open', () => {
      const result = displayOpenResults({ query: { } }, bankHoliday);

      expect(result).to.equal(true);
    });

    it('should return false when query contains open and it is not equal to true', () => {
      const result = displayOpenResults({ query: { open: 'NOT true' } }, bankHoliday);

      expect(result).to.equal(false);
    });
  });
});
