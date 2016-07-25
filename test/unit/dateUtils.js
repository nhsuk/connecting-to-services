const chai = require('chai');
const expect = chai.expect;
const dateUtils = require('../../app/lib/dateUtils.js');

describe('dateUtils', () => {
  describe('timeInRange', () => {
    describe('GMT date', () => {
      it('should return true if time is in range', () => {
        const inRange = dateUtils.timeInRange(
          new Date('December 13, 2014 09:05:00'),
          '09:00',
          '17:30');
        expect(inRange).to.equal(true);
      });
      it('should return false if time is below range', () => {
        const inRange = dateUtils.timeInRange(
          new Date('December 13, 2014 08:55:00'),
          '09:00',
          '17:30');
        expect(inRange).to.equal(false);
      });
    });
    describe('BST date', () => {
      it('should return true if time is in range', () => {
        const inRange = dateUtils.timeInRange(
          new Date('October 13, 2014 09:05:00'),
          '09:00',
          '17:30');
        expect(inRange).to.equal(true);
      });
      it('should return false if time is below the range (BST)', () => {
        const inRange = dateUtils.timeInRange(
          new Date('October 13, 2014 08:55:00'),
          '09:00',
          '17:30');
        expect(inRange).to.equal(false);
      });
      it('should return false if time is above the range (BST)', () => {
        const inRange = dateUtils.timeInRange(
          new Date('October 13, 2014 18:30:00'),
          '09:00',
          '17:30');
        expect(inRange).to.equal(false);
      });
    });
    it('should handle an end time of midnight or later', () => {
      // Range of times to check nothing bad happens with BST adjustments
      ['00:00', '01:00', '02:30'].forEach((endTime) => {
        expect(dateUtils.timeInRange(
          new Date('October 13, 2014 18:30:00'),
          '08:00',
          endTime))
          .to.equal(true);
      });
    });
    it('should handle opening times which span transitions to/from BST');
  });
  describe('getDayName', () => {
  });
  describe('getDayName', () => {
    it('should return day name', () => {
      expect(dateUtils.getDayName(new Date('July 23, 2016'))).to.equal('saturday');
    });
  });
  describe('isOpen', () => {
    it('should return false if closed all day', () => {
      const openingTimes = ['Closed'];
      const date = new Date('July 23, 2016');
      expect(dateUtils.isOpen(date, openingTimes)).to.equal(false);
    });
    describe('different time zones', () => {
      const openingTimes = [{ fromTime: '09:00', toTime: '17:30' }];
      it('UTC', () => {
        const date = new Date('2016-07-23T08:08:48.566Z');
        expect(dateUtils.isOpen(date, openingTimes)).to.equal(true);
      });
      it('BST', () => {
        const date = new Date('Sat Jul 23 2016 09:08:48 GMT+0100');
        expect(dateUtils.isOpen(date, openingTimes)).to.equal(true);
      });
    });
  });
});
