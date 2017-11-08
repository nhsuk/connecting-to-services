const messages = require('../../../app/lib/messages');
const chai = require('chai');

const expect = chai.expect;

describe('messages', () => {
  it('should have a message for an invalid postcode where the location has been capitalised', () => {
    const location = 'something';
    const expectedMessage =
      `We can't find the postcode ${location.toLocaleUpperCase()}. Check the postcode is correct and try again.`;

    const message = messages.invalidPostcodeMessage(location);

    expect(message).to.not.be.equal(null);
    expect(message).to.be.equal(expectedMessage);
  });

  it('should have an error message for when nothing has been entered to search with', () => {
    const message = messages.emptyPostcodeMessage();

    expect(message).to.equal('You must insert a place or a postcode to find a pharmacy.');
  });

  it('should have an error message for technical problems', () => {
    const message = messages.technicalProblems();

    expect(message).to.equal('Sorry, we are experiencing technical problems');
  });
});
