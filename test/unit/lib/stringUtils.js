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

  describe('joinWithCommas', () => {
    it('should return no commas or and for a single word', () => {
      const words = ['One'];
      const joined = stringUtils.joinWithCommas(words);

      expect(joined).to.equal('One');
    });

    it('should return an and for a two words', () => {
      const words = ['One', 'Two'];
      const joined = stringUtils.joinWithCommas(words);

      expect(joined).to.equal('One and Two');
    });

    it('should return a comma and an \'and\' for a two words', () => {
      const words = ['One', 'Two', 'Three'];
      const joined = stringUtils.joinWithCommas(words);

      expect(joined).to.equal('One, Two and Three');
    });

    it('should return a comma and an \'and\' for a many words', () => {
      const words = ['One', 'Two', 'Three', 'Four', 'Five'];
      const joined = stringUtils.joinWithCommas(words);

      expect(joined).to.equal('One, Two, Three, Four and Five');
    });
  });
});
