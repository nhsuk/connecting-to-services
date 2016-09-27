const chai = require('chai');
const validateLocation = require('../../../app/lib/locationValidator');

const expect = chai.expect;

describe('Location validation', () => {
  describe('error handling', () => {
    const invalidPostcode = 'invalid';

    it('should return an errorMessage for an invalid postcode', () => {
      const result = validateLocation(invalidPostcode);

      expect(result.errorMessage)
        .to.be
        .equal(`${invalidPostcode} is not a valid postcode, please try again`);
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
    const validPostcode = 'AB12 3CD';

    it('should pass validation with a valid outcode', () => {
      const outcode = 'AB12';

      const result = validateLocation(outcode);

      expect(result.input).to.be.equal(outcode);
      // eslint-disable-next-line no-unused-expressions
      expect(result.errorMessage).to.be.null;
    });
    it('should pass validation with a valid full postcode', () => {
      const result = validateLocation(validPostcode);

      expect(result.input).to.be.equal(validPostcode);
      // eslint-disable-next-line no-unused-expressions
      expect(result.errorMessage).to.be.null;
    });
    it('should return the input', () => {
      const result = validateLocation(validPostcode);

      expect(result).to.be.an('object');
      expect(result.input).to.be.equal(validPostcode);
    });
    it('should return an object with expected properties', () => {
      const result = validateLocation(validPostcode);

      expect(result).to.be.an('object');
      expect(result).to.have.property('input');
      expect(result).to.have.property('errorMessage');
    });
  });
});
