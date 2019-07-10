const chai = require('chai');
const canonicalUrl = require('../../../app/lib/canonicalUrl');
const SITE_ROOT = require('../../../app/lib/constants');

const expect = chai.expect;

describe('canonicalUrl', () => {
  const hostname = 'some.host.name';

  const reqMock = {
    app: {
      locals: {
        SITE_ROOT,
      },
    },
    hostname,
  };
  const expectedUrl = `https://${hostname}${SITE_ROOT}/`;

  it('should return the current URL via https', () => {
    const url = canonicalUrl(reqMock);
    expect(url).to.equal(expectedUrl);
  });
});
