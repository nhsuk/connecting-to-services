const chai = require('chai');
const utils = require('../../../app/lib/utils');

const expect = chai.expect;

describe('utils', () => {
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
