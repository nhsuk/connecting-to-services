const chai = require('chai');
const Postcode = require('postcode');

const messages = require('../../../../app/lib/messages');
const postcodeValidator = require('../../../../app/lib/postcodeValidator');

const expect = chai.expect;

describe('Location validation', () => {
  describe('error handling', () => {
    const invalidPostcode = 'invalid';

    it('should return an errorMessage for an invalid postcode', () => {
      const expectedErrorMessage = messages.invalidPostcodeMessage(invalidPostcode);

      const result = postcodeValidator(invalidPostcode);

      expect(result.errorMessage)
        .to.be
        .equal(expectedErrorMessage);
    });

    it('should return the input', () => {
      const result = postcodeValidator(invalidPostcode);

      expect(result.alteredLocation).to.be.equal(invalidPostcode);
    });

    it('should return an object with expected properties', () => {
      const result = postcodeValidator(invalidPostcode);

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

        const result = postcodeValidator(outcodeNeedsTrimming);

        expect(result.alteredLocation).to.be.equal(trimmedOutcode);
        expect(result.errorMessage).to.be.null;
      });

      it('should pass validation with a valid outcode', () => {
        const outcode = 'AB12';

        const result = postcodeValidator(outcode);

        expect(result.alteredLocation).to.be.equal(outcode);
        expect(result.errorMessage).to.be.null;
      });

      it('should pass validation for a valid outcode with extra spaces', () => {
        const outcode = ' AB  12 ';

        const result = postcodeValidator(outcode);

        expect(result.alteredLocation).to.be.equal('AB12');
        expect(result.errorMessage).to.be.null;
      });
    });

    describe('for postcode', () => {
      const validPostcode = 'ab123cd';
      const result = postcodeValidator(validPostcode);
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
