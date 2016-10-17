const messages = require('../../../app/lib/messages');
const chai = require('chai');

const expect = chai.expect;

describe('messages', () => {
  it('should have a message for an invalid postcode', () => {
    const location = 'something';
    const message = messages.invalidPostcodeMessage(location);

    expect(message).to.not.be.equal(null);
    expect(message).to.be.equal(`${location} is not a valid postcode, please try again`);
  });
});
