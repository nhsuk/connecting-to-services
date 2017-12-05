const chai = require('chai');
const completeOriginalUrl = require('../../../app/lib/completeOriginalUrl');

const expect = chai.expect;

describe('completeOriginalUrl', () => {
  const reqMock = { hostname: 'beta.nhs.uk', originalUrl: '/find-a-pharmacy/results?location=ls' };
  const mockOriginalUrl = 'https://beta.nhs.uk/find-a-pharmacy/results?location=ls';
  it('should return the current URL', () => {
    const url = completeOriginalUrl(reqMock);
    expect(url).to.equal(mockOriginalUrl);
  });
});
