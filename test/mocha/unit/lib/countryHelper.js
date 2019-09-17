const chai = require('chai');
const countryHelper = require('../../../../app/lib/countryHelper');

const expect = chai.expect;
const countryToMatch = 'Wales';

describe('countryHelper', () => {
  describe('showCountry', () => {
    it('should return true for undefined countries', () => {
      expect(countryHelper.showCountry(undefined, countryToMatch)).to.be.true;
    });

    it('should return true for empty countries array', () => {
      expect(countryHelper.showCountry([], countryToMatch)).to.be.true;
    });

    it('should return true when country to match is in countries array', () => {
      expect(countryHelper.showCountry(['Scotland', countryToMatch], countryToMatch)).to.be.true;
    });

    it('should return false when country to match is not in countries array', () => {
      expect(countryHelper.showCountry(['Scotland'], countryToMatch)).to.be.false;
    });
  });
  describe('hasNoCountries', () => {
    it('should return true for undefined countries', () => {
      expect(countryHelper.hasNoCountries(undefined)).to.be.true;
    });

    it('should return true for empty countries array', () => {
      expect(countryHelper.hasNoCountries([])).to.be.true;
    });

    it('should return false when countries array is populated', () => {
      expect(countryHelper.hasNoCountries(['Scotland'])).to.be.false;
    });
  });
});
