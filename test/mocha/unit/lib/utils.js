const chai = require('chai');
const moment = require('moment');
const utils = require('../../../../app/lib/utils');

const expect = chai.expect;

describe('utils', () => {
  describe('isTimeConsideredMidnight', () => {
    it('should return true for midnight proper', () => {
      const result = utils.isTimeConsideredMidnight(moment('2019-01-10 00:00', 'YYYY-MM-DD HH:mm'));
      expect(result).to.be.true;
    });
    it('should return true for 1 minute to midnight', () => {
      const result = utils.isTimeConsideredMidnight(moment('2019-01-10 23:59', 'YYYY-MM-DD HH:mm'));
      expect(result).to.be.true;
    });
    it('should return false for 2 minutes to midnight', () => {
      const result = utils.isTimeConsideredMidnight(moment('2019-01-10 23:58', 'YYYY-MM-DD HH:mm'));
      expect(result).to.be.false;
    });
    it('should return false for 1.25 minutes to midnight', () => {
      const result = utils.isTimeConsideredMidnight(moment('2019-01-10 23:58:45', 'YYYY-MM-DD HH:mm:ss'));
      expect(result).to.be.false;
    });
    it('should return false for 0.25 minutes after midnight', () => {
      const result = utils.isTimeConsideredMidnight(moment('2019-01-10 00:00:15', 'YYYY-MM-DD HH:mm:ss'));
      expect(result).to.be.true;
    });
  });
  describe('deepClone', () => {
    describe('value properties', () => {
      const objToClone = { a: 'a' };
      const clone = utils.deepClone(objToClone);

      it('should clone', () => {
        expect(clone).to.deep.equal(objToClone);
      });

      it('should not affect original object', () => {
        clone.a = 'new value';
        expect(clone).to.not.deep.equal(objToClone);
      });
    });

    describe('object properties', () => {
      const objToClone = { a: { b: 'b' } };
      const clone = utils.deepClone(objToClone);

      it('should clone object properties', () => {
        expect(clone).to.deep.equal(objToClone);
      });

      it('should not affect original object', () => {
        clone.a = 'new value';
        expect(clone).to.not.deep.equal(objToClone);
      });
    });
  });
});
