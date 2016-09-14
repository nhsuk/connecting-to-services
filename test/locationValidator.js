const chai = require('chai');
const validateLocation = require('../lib/locationValidator');

const expect = chai.expect;

describe('Location validation', () => {
  describe('error handling', () => {
    let sentMessage;
    const fakeRes = { send: (message) => { sentMessage = message; } };

    it('should return a message for an invalid postcode', () => {
      const invalidPostcode = 'invalid';
      const req = { query: { location: invalidPostcode } };

      validateLocation(req, fakeRes, () => {});

      expect(sentMessage)
        .to.be
        .equal(`${invalidPostcode} is not a valid postcode, please try again`);
    });

    it('should return a message when no location is provided', () => {
      const req = { query: {} };

      validateLocation(req, fakeRes, () => {});

      expect(sentMessage).to.be.equal('A valid postcode is required to progress');
    });
  });

  describe('happy path', () => {
    it('should pass validation with a valid postcode', () => {
      const validPostcode = 'AB12 3CD';
      const req = { query: { location: validPostcode } };

      validateLocation(req, {}, () => {});

      expect(req.message).to.be.equal(validPostcode);
    });
  });
});
