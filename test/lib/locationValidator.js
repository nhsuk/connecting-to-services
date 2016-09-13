const chai = require('chai');
const validateLocation = require('../../lib/locationValidator');

const expect = chai.expect;

describe('Location validation', () => {
  it('should return a message for an invalid postcode', () => {
    const invalidPostcode = 'invalid';
    const req = { query: { location: invalidPostcode } };

    validateLocation(req, {}, () => {});

    expect(req.message).to.be.equal(`${invalidPostcode} is not a valid postcode, please try again`);
  });

  it('should pass validation with a valid postcode', () => {
    const validPostcode = 'AB12 3CD';
    const req = { query: { location: validPostcode } };

    validateLocation(req, {}, () => {});

    expect(req.message).to.be.equal(validPostcode);
  });

  it('should return a message when no location is provided', () => {
    const req = { query: {} };

    validateLocation(req, {}, () => {});

    expect(req.message).to.be.equal('A valid postcode is required to progress');
  });
});
