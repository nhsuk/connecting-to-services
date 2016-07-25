const chai = require('chai');
const expect = chai.expect;
const dateUtils = require('../../app/lib/dateUtils.js');
const moment = require('moment');

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
    it('should handle opening times which span transitions to/from BST');
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
});
