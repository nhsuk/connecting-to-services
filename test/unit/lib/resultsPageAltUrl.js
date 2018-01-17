const chai = require('chai');

const resultsPageAltUrl = require('../../../app/lib/resultsPageAltUrl');
const siteRoot = require('../../../app/lib/constants').SITE_ROOT;

const expect = chai.expect;

describe('resultsPageAltUrl', () => {
  const latitude = 53;
  const longitude = 1;
  const path = '/results';
  const baseUrl = `${siteRoot}${path}?latitude=${latitude}&longitude=${longitude}`;

  it('should return a URL with the open param as true when the original request does not include open', () => {
    const url = resultsPageAltUrl({ query: { latitude, longitude }, path });

    expect(url).to.equal(`${baseUrl}&open=true`);
  });

  it('should return a URL with the open param as true when the original request includes open as false', () => {
    const url = resultsPageAltUrl({ query: { latitude, longitude, open: 'false' }, path });

    expect(url).to.equal(`${baseUrl}&open=true`);
  });

  it('should return a URL with the open param as true when the original request includes open with no value', () => {
    const url = resultsPageAltUrl({ query: { latitude, longitude, open: '' }, path });

    expect(url).to.equal(`${baseUrl}&open=true`);
  });

  it('should return a URL with the open param as false when the original request included open as true', () => {
    const url = resultsPageAltUrl({ query: { latitude, longitude, open: 'true' }, path });

    expect(url).to.equal(`${baseUrl}&open=false`);
  });

  it('should return a URL with the open param as false when the original request included open as TRUE', () => {
    const url = resultsPageAltUrl({ query: { latitude, longitude, open: 'TRUE' }, path });

    expect(url).to.equal(`${baseUrl}&open=false`);
  });
});
