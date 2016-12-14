const chai = require('chai');
const validateLocation = require('../../../app/lib/locationValidator');
const messages = require('../../../app/lib/messages');
const Postcode = require('postcode');

const expect = chai.expect;

describe('Location validation', () => {
  describe('error handling', () => {
    const invalidPostcode = 'invalid';

    it('should return an errorMessage for an invalid postcode', () => {
      const expectedErrorMessage = messages.invalidPostcodeMessage(invalidPostcode);

      const result = validateLocation(invalidPostcode);

      expect(result.errorMessage)
        .to.be
        .equal(expectedErrorMessage);
    });

    it('should return an errorMessage when no location is provided', () => {
      const emptyLocation = '';

      const result = validateLocation(emptyLocation);

      expect(result.errorMessage)
        .to.be
        .equal('A valid postcode is required to progress');
    });

    it('should return the input', () => {
      const result = validateLocation(invalidPostcode);

      expect(result.input).to.be.equal(invalidPostcode);
    });

    it('should return an object with expected properties', () => {
      const result = validateLocation(invalidPostcode);

      expect(result).to.be.an('object');
      expect(result).to.have.property('input');
      expect(result).to.have.property('errorMessage');
    });
  });

  describe('happy path', () => {
    describe('for outcode', () => {
      it('should return the trimmed input, capitalised', () => {
        const outcodeNeedsTrimming = '  ab1  ';
        const trimmedOutcode = 'AB1';

        const result = validateLocation(outcodeNeedsTrimming);

        expect(result.input).to.be.equal(trimmedOutcode);
        // eslint-disable-next-line no-unused-expressions
        expect(result.errorMessage).to.be.null;
      });

      it('should pass validation with a valid outcode', () => {
        const outcode = 'AB12';

        const result = validateLocation(outcode);

        expect(result.input).to.be.equal(outcode);
        // eslint-disable-next-line no-unused-expressions
        expect(result.errorMessage).to.be.null;
      });
    });

    describe('for postcode', () => {
      const validPostcode = 'ab123cd';
      const result = validateLocation(validPostcode);
      const formattedPostcode = new Postcode(validPostcode).normalise();

      it('should pass validation and return a formatted postcode with a valid full postcode', () => {
        expect(result.input).to.be.equal(formattedPostcode);
        // eslint-disable-next-line no-unused-expressions
        expect(result.errorMessage).to.be.null;
      });

      it('should return the input', () => {
        expect(result).to.be.an('object');
        expect(result.input).to.be.equal(formattedPostcode);
      });

      it('should return an object with expected properties', () => {
        expect(result).to.be.an('object');
        expect(result).to.have.property('input');
        expect(result).to.have.property('errorMessage');
      });

      it('should return the trimmed input', () => {
        const postcodeNeedsTrimming = '  ab123cd  ';

        const trimmedResult = validateLocation(postcodeNeedsTrimming);

        expect(trimmedResult.input).to.be.equal(formattedPostcode);
        // eslint-disable-next-line no-unused-expressions
        expect(trimmedResult.errorMessage).to.be.null;
      });
    });
  });
});
