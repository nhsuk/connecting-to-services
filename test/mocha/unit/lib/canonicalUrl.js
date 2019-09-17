const chai = require('chai');
const canonicalUrl = require('../../../../app/lib/canonicalUrl');
const siteRoot = require('../../../../app/lib/constants');

const expect = chai.expect;

describe('canonicalUrl', () => {
  const hostname = 'some.host.name';

  const reqMock = {
    app: {
      locals: {
        siteRoot,
      },
    },
    hostname,
  };
  const expectedUrl = `https://${hostname}${siteRoot}/`;

  it('should return the current URL via https', () => {
    const url = canonicalUrl(reqMock);
    expect(url).to.equal(expectedUrl);
  });
});
