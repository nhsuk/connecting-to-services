const chai = require('chai');
const englishPostcodeValidator = require('../../../app/lib/englishPostcodeValidator');
const messages = require('../../../app/lib/messages');
const Postcode = require('postcode');

const expect = chai.expect;

describe('Location validation', () => {
  describe('error handling', () => {
    const invalidPostcode = 'invalid';

    it('should return an errorMessage for an invalid postcode', () => {
      const expectedErrorMessage = messages.invalidPostcodeMessage(invalidPostcode);

      const result = englishPostcodeValidator(invalidPostcode);

      expect(result.errorMessage)
        .to.be
        .equal(expectedErrorMessage);
    });

    it('should return the input', () => {
      const result = englishPostcodeValidator(invalidPostcode);

      expect(result.alteredLocation).to.be.equal(invalidPostcode);
    });

    it('should return an object with expected properties', () => {
      const result = englishPostcodeValidator(invalidPostcode);

      expect(result).to.be.an('object');
      expect(result).to.have.property('alteredLocation');
      expect(result).to.have.property('errorMessage');
    });
  });

  describe('happy path', () => {
    describe('for outcode', () => {
      it('should return the input capitalised', () => {
        const outcodeNeedsTrimming = 'ab1';
        const trimmedOutcode = 'AB1';

        const result = englishPostcodeValidator(outcodeNeedsTrimming);

        expect(result.alteredLocation).to.be.equal(trimmedOutcode);
        expect(result.errorMessage).to.be.null;
      });

      it('should pass validation with a valid outcode', () => {
        const outcode = 'AB12';

        const result = englishPostcodeValidator(outcode);

        expect(result.alteredLocation).to.be.equal(outcode);
        expect(result.errorMessage).to.be.null;
      });
    });

    describe('for postcode', () => {
      const validPostcode = 'ab123cd';
      const result = englishPostcodeValidator(validPostcode);
      const formattedPostcode = new Postcode(validPostcode).normalise();

      it('should pass validation and return a formatted postcode with a valid full postcode', () => {
        expect(result.alteredLocation).to.be.equal(formattedPostcode);
        expect(result.errorMessage).to.be.null;
      });

      it('should return the input', () => {
        expect(result).to.be.an('object');
        expect(result.alteredLocation).to.be.equal(formattedPostcode);
      });

      it('should return an object with expected properties', () => {
        expect(result).to.be.an('object');
        expect(result).to.have.property('alteredLocation');
        expect(result).to.have.property('errorMessage');
      });
    });
  });
});
