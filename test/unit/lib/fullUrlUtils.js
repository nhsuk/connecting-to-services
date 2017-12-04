const chai = require('chai');
const fullUrlUtils = require('../../../app/lib/fullUrlUtils');

const expect = chai.expect;

describe('fullUrlUtils', () => {
  function host() { return 'beta.nhs.uk'; }
  const mockReturnUrl = 'https://beta.nhs.uk/find-a-pharmacy/results?location=ls';

  describe('url', () => {
    const reqMock = { protocol: 'https', get: host, originalUrl: '/find-a-pharmacy/results?location=ls' };
    it('should return the current URL', () => {
      const url = fullUrlUtils(reqMock).url;

      expect(url).to.equal(mockReturnUrl);
    });
  });
});
