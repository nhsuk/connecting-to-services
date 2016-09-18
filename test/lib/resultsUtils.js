const chai = require('chai');
const utils = require('../../lib/resultsUtils');

const expect = chai.expect;

describe('Result utilities', () => {
  let originalApikey = '';
  const apikey = 'secret';

  before('setup environment variables', () => {
    originalApikey = process.env.NHSCHOICES_SYNDICATION_APIKEY;

    process.env.NHSCHOICES_SYNDICATION_APIKEY = apikey;
  });
  after('reset environemnt variables', () => {
    process.env.NHSCHOICES_SYNDICATION_APIKEY = originalApikey;
  });

  describe('generateRequestUrl', () => {
    it('should generate request Url for pharmacies postcode search', () => {
      const baseUrl = process.env.NHSCHOICES_SYNDICATION_BASEURL;
      const location = 'somewhere';
      const fakeReq = { query: { location } };
      const expectedUrl =
        `${baseUrl}/organisations/pharmacies/postcode/` +
        `${location}.xml?apikey=${apikey}&range=100&page=`;

      const url = utils.generateRequestUrl(fakeReq);

      expect(url).to.be.equal(expectedUrl);
    });
  });

  describe('generateOverviewRequestUrls', () => {
    it('should return an array of urls, one for each result', () => {
      const idOne = 'http://web.site/thing/idOne';
      const results = [{ id: idOne }, { id: 2 }, { id: 3 }];
      const expectedUrl = `${idOne}/overview.xml?apikey=${apikey}`;

      const urls = utils.generateOverviewRequestUrls(results);

      expect(urls).to.be.instanceof(Array);
      expect(urls.length).to.be.equal(3);
      expect(urls[0]).to.be.equal(expectedUrl);
    });
  });
});
