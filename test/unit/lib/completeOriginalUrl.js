const chai = require('chai');
const completeOriginalUrl = require('../../../app/lib/completeOriginalUrl');

const { expect } = chai;

describe('completeOriginalUrl', () => {
  const reqMock = { hostname: 'beta.nhs.uk', originalUrl: '/find-a-pharmacy/results?location=ls' };
  const expectedUrl = 'https://beta.nhs.uk/find-a-pharmacy/results?location=ls';
  it('should return the current URL via https', () => {
    const url = completeOriginalUrl(reqMock);
    expect(url).to.equal(expectedUrl);
  });
});
