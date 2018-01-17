const chai = require('chai');
const constants = require('../../../app/lib/constants');
const getRequestUrl = require('../../../app/lib/getRequestUrl');

const expect = chai.expect;

describe('getRequestUrl', () => {
  const latitude = 53;
  const longitude = 1;
  const coordinates = { latitude, longitude };
  it('should return url for open results when open results are to be returned', () => {
    const openPath = constants.api.paths.open;
    const openResults = constants.api.openResultsCount;
    const url = getRequestUrl(coordinates, true);

    expect(url).to.have.string(`/${openPath}?latitude=${latitude}&longitude=${longitude}&limits:results=${openResults}`);
  });

  it('should return url for nearby results when nearby results are to be returned', () => {
    const nearbyPath = constants.api.paths.nearby;
    const nearbyResults = constants.api.nearbyResultsCount;
    const url = getRequestUrl(coordinates, false);

    expect(url).to.have.string(`/${nearbyPath}?latitude=${latitude}&longitude=${longitude}&limits:results=${nearbyResults}`);
  });
});
