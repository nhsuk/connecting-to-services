const chai = require('chai');
const utils = require('../../../app/lib/utils');

const expect = chai.expect;

describe('utils', () => {
  describe('deepClone', () => {
    it('should clone value properties', () => {
      const objToClone = { a: 'a' };

      const clone = utils.deepClone(objToClone);

      expect(clone).to.deep.equal(objToClone);

      clone.a = 'new value';
      expect(clone).to.not.deep.equal(objToClone);
    });

    it('should clone object properties', () => {
      const objToClone = { a: { b: 'b' } };

      const clone = utils.deepClone(objToClone);

      expect(clone).to.deep.equal(objToClone);

      clone.a = 'new value';
      expect(clone).to.not.deep.equal(objToClone);
    });
  });

  describe('flip', () => {
    it('should return false as a string when it is passed true as a string', () => {
      const result = utils.flip('true');

      expect(result).to.be.equal('false');
    });

    it('should return true as a string when it is passed false as a string', () => {
      const result = utils.flip('false');

      expect(result).to.be.equal('true');
    });
  });
});
