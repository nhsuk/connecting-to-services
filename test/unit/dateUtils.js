const chai = require('chai');
const dateUtils = require('../../app/lib/dateUtils');
const moment = require('moment');

const expect = chai.expect;

describe('dateUtils', () => {
  describe('timeInRange', () => {
    describe('BST date', () => {
      it('should return true if time is in range', () => {
        const inRange = dateUtils.timeInRange(
            moment('2016-07-25T09:30:00+01:00'),
            '09:00',
            '17:30');
        expect(inRange).to.equal(true);
      });
      it('should return false if time is below range', () => {
        const inRange = dateUtils.timeInRange(
            moment('2016-07-25T08:30:00+01:00'),
            '09:00',
            '17:30');
        expect(inRange).to.equal(false);
      });
      it('should return false if time is above the range)', () => {
        const inRange = dateUtils.timeInRange(
            moment('2016-07-25T18:00:00+01:00'),
            '09:00',
            '17:30');
        expect(inRange).to.equal(false);
      });
    });
    it('should handle an end time of midnight or later', () => {
      // Range of times to check nothing bad happens with BST adjustments
      ['00:00', '01:00', '02:30'].forEach((endTime) => {
        expect(dateUtils.timeInRange(
              moment('2016-07-25T18:30:00+01:00'),
              '08:00',
              endTime))
          .to.equal(true);
      });
    });
    it('time ranges should be inclusive', () => {
      expect(dateUtils.timeInRange(moment('2016-07-26T18:00:00+01:00'), '09:00', '18:00'))
        .to.equal(true);
    });
    it('should handle opening times which span transitions to/from BST');
    it('should handle reference time after midnight', () => {
      const inRange = dateUtils.timeInRange(
          moment('2016-07-25T00:30:00+01:00'),
          '09:00',
          '01:00');
      expect(inRange).to.equal(true);
    });
  });
  describe('getDayName', () => {
    it('should return day name', () => {
      expect(dateUtils.getDayName(moment('2016-07-23T18:30:00+01:00')))
        .to.equal('saturday');
    });
  });
  describe('isOpen', () => {
    it('should return false if closed all day', () => {
      const openingTimes = ['Closed'];
      const date = moment('2016-07-25T18:30:00+01:00');
      expect(dateUtils.isOpen(date, openingTimes)).to.equal(false);
    });
    describe('different time zones', () => {
      const openingTimes = [{ fromTime: '09:00', toTime: '17:30' }];
      it('UTC', () => {
        const date = moment('2016-07-25T11:30:00+00:00');
        expect(dateUtils.isOpen(date, openingTimes)).to.equal(true);
      });
      it('BST', () => {
        const date = moment('2016-07-25T11:30:00+01:00');
        expect(dateUtils.isOpen(date, openingTimes)).to.equal(true);
      });
    });
  });
  describe('nextClosed', () => {
    const openingTimes = {
      monday: { times: [{ fromTime: '09:00', toTime: '17:30' }] },
      tuesday: { times: [{ fromTime: '09:00', toTime: '01:30' }] },
      wednesday: { times: [{ fromTime: '09:00', toTime: '17:30' }] },
      thursday: { times: [{ fromTime: '09:00', toTime: '17:30' }] },
      friday: { times: [{ fromTime: '09:00', toTime: '17:30' }] },
      saturday: { times: ['Closed'] },
      sunday: { times: ['Closed'] },
    };
    describe('currently open', () => {
      it('when during todays opening time should return todays closed time', () => {
        const date = moment('2016-07-25T11:30:00+01:00');
        const nextClosed = dateUtils.nextClosed(date, openingTimes);
        expect(nextClosed.day).to.equal('today');
        expect(nextClosed.time.format()).to.equal('2016-07-25T17:30:00+01:00');
      });
      it('when closing time is after midnight should return tomorrows closing time', () => {
        const date = moment('2016-07-26T11:30:00+01:00');
        const nextClosed = dateUtils.nextClosed(date, openingTimes);
        expect(nextClosed.day).to.equal('tomorrow');
        expect(nextClosed.time.format()).to.equal('2016-07-27T01:30:00+01:00');
      });
    });
  });
  describe('nextOpen', () => {
    const openingTimes = {
      monday: { times: [{ fromTime: '09:00', toTime: '17:30' }] },
      tuesday: { times: [{ fromTime: '09:00', toTime: '17:30' }] },
      friday: { times: [{ fromTime: '09:00', toTime: '17:30' }] },
      saturday: { times: ['Closed'] },
      sunday: { times: ['Closed'] },
    };
    describe('currently closed', () => {
      it('when before todays opening time should return todays opening time', () => {
        const date = moment('2016-07-25T07:30:00+01:00');
        const nextOpen = dateUtils.nextOpen(date, openingTimes);
        expect(nextOpen.day).to.equal('today');
        expect(nextOpen.time.format()).to.equal('2016-07-25T09:00:00+01:00');
      });
      it('when after todays closing time should return tomorrows opening time', () => {
        const date = moment('2016-07-25T21:30:00+01:00');
        const nextOpen = dateUtils.nextOpen(date, openingTimes);
        expect(nextOpen.day).to.equal('tomorrow');
        expect(nextOpen.time.format()).to.equal('2016-07-26T09:00:00+01:00');
      });
      it('when after fridays closing time should return mondays opening time', () => {
        const date = moment('2016-07-29T18:30:00+01:00');
        const nextOpen = dateUtils.nextOpen(date, openingTimes);
        expect(nextOpen.day).to.equal('Monday');
        expect(nextOpen.time.format()).to.equal('2016-08-01T09:00:00+01:00');
      });
      it('when currently a saturday then should return mondays opening time', () => {
        const date = moment('2016-07-30T09:30:00+01:00');
        const nextOpen = dateUtils.nextOpen(date, openingTimes);
        expect(nextOpen.day).to.equal('Monday');
        expect(nextOpen.time.format()).to.equal('2016-08-01T09:00:00+01:00');
      });
    });
  });
});
