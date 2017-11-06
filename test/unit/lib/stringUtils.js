const chai = require('chai');
const stringUtils = require('../../../app/lib/stringUtils');

const expect = chai.expect;

describe('stringUtils', () => {
  describe('removeNonAlphabeticAndWhitespace', () => {
    it('should remove multiple spaces between words', () => {
      const word = stringUtils.removeNonAlphabeticAndWhitespace('stoke  newington');

      expect(word).to.equal('stoke newington');
    });

    it('should remove leading and trailing spaces in words', () => {
      const word = stringUtils.removeNonAlphabeticAndWhitespace('  stoke newington  ');

      expect(word).to.equal('stoke newington');
    });

    it('should ignore non-alphanumeric character', async () => {
      const word = await stringUtils.removeNonAlphabeticAndWhitespace('stoke . newington');

      expect(word).to.equal('stoke newington');
    });
  });
});
