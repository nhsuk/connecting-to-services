const chai = require('chai');
const utils = require('../lib/resultsUtils');

const expect = chai.expect;

describe('Result utilities', () => {
  it('should generate request Url for pharmacies postcode search', () => {
    const apikey = process.env.NHSCHOICES_SYNDICATION_APIKEY;
    const baseUrl = process.env.NHSCHOICES_SYNDICATION_BASEURL;
    const location = 'somewhere';
    const fakeReq = { query: { location } };
    const expectedUrl =
      `${baseUrl}/organisations/pharmacies/postcode/${location}.xml?apikey=${apikey}&range=100&page=`;

    const url = utils.generateRequestUrl(fakeReq);

    expect(url).to.be.equal(expectedUrl);
  });
});
