const chai = require('chai');
const utils = require('../../../app/lib/utils');
const bunyan = require('bunyan');

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

  describe('getLogLevel', () => {
    it('should return INFO for production', () => {
      const logLevel = utils.getLogLevel('production');

      expect(logLevel).to.be.equal(bunyan.INFO);
    });
    it('should return DEBUG for development', () => {
      const logLevel = utils.getLogLevel('development');

      expect(logLevel).to.be.equal(bunyan.DEBUG);
    });
    it('should return DEBUG for an unknown environment', () => {
      const logLevel = utils.getLogLevel('unknown');

      expect(logLevel).to.be.equal(bunyan.DEBUG);
    });
    it('should return FATAL for test', () => {
      const logLevel = utils.getLogLevel('test');

      expect(logLevel).to.be.equal(bunyan.FATAL);
    });
  });
});
