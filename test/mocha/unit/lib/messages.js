const chai = require('chai');

const messages = require('../../../../app/lib/messages');

const expect = chai.expect;

describe('messages', () => {
  it('should have a message for an invalid postcode where the location is as entered', () => {
    const location = 'something';
    const expectedMessage = `We can't find the postcode '${location}'. Check the postcode is correct and try again.`;

    const message = messages.invalidPostcodeMessage(location);

    expect(message).to.not.be.equal(null);
    expect(message).to.be.equal(expectedMessage);
  });

  it('should have an error message for when nothing has been entered to search with', () => {
    const message = messages.emptyPostcodeMessage();

    expect(message).to.equal('You must enter a town, city or postcode to find a pharmacy.');
  });

  it('should have an error message for technical problems', () => {
    const message = messages.technicalProblems();

    expect(message).to.equal('Sorry, we are experiencing technical problems');
  });

  it('should have a message for today being a bank holiday', () => {
    const message = messages.bankHolidayToday();

    expect(message).to.equal('Today is a bank holiday. Please call to check opening times.');
  });

  it('should have a message for bank holidays in the future - tomorrow', () => {
    const nowDateString = '2017-12-01';
    const nextOpenDateString = '2017-12-02';
    const message = messages.bankHolidayFuture(nowDateString, nextOpenDateString);

    expect(message).to.equal('Tomorrow is a bank holiday. Please call to check opening times.');
  });

  it('should have a message for bank holidays in the future - 3 days time', () => {
    const nowDateString = '2017-12-01';
    const nextOpenDateString = '2017-12-04';
    const message = messages.bankHolidayFuture(nowDateString, nextOpenDateString);

    expect(message).to.equal('Monday is a bank holiday. Please call to check opening times.');
  });
});
