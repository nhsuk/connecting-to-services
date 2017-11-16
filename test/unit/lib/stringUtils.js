const chai = require('chai');
const stringUtils = require('../../../app/lib/stringUtils');

const expect = chai.expect;

describe('stringUtils', () => {
  describe('removeNonAlphanumericAndDoubleSpaces', () => {
    it('should remove multiple spaces between words', () => {
      const word = stringUtils.removeNonAlphanumericAndDoubleSpaces('stoke  newington');

      expect(word).to.equal('stoke newington');
    });

    it('should remove leading and trailing spaces in words', () => {
      const word = stringUtils.removeNonAlphanumericAndDoubleSpaces('  stoke newington  ');

      expect(word).to.equal('stoke newington');
    });

    it('should ignore non-alphanumeric character', () => {
      const word = stringUtils.removeNonAlphanumericAndDoubleSpaces('stoke . newington 123');

      expect(word).to.equal('stoke newington 123');
    });
  });

  describe('removeNonAddressCharacters', () => {
    it('should leave numbers and commas intact', () => {
      const word = stringUtils.removeNonAddressCharacters('Leeds, Yorkshire and the Humber, LS1 £@$%$%£$%');

      expect(word).to.equal('Leeds, Yorkshire and the Humber, LS1');
    });
  });

  describe('removeNonAlphanumericAndWhitespace', () => {
    it('should remove spaces and special characters', () => {
      const word = stringUtils.removeNonAlphanumericAndWhitespace('L S 1 @£$@£$£@$');

      expect(word).to.equal('LS1');
    });
  });
});
