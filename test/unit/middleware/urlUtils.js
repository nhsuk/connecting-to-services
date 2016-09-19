const chai = require('chai');
const urlUtils = require('../../../app/middleware/urlUtils');

const expect = chai.expect;

describe('urlUtils', () => {
  let originalUrl = '';
  let originalApikey = '';
  const baseUrl = 'http://web.site';
  const apikey = 'secret';

  before('setup environment variables', () => {
    originalUrl = process.env.NHSCHOICES_SYNDICATION_BASEURL;
    originalApikey = process.env.NHSCHOICES_SYNDICATION_APIKEY;

    process.env.NHSCHOICES_SYNDICATION_BASEURL = baseUrl;
    process.env.NHSCHOICES_SYNDICATION_APIKEY = apikey;
  });

  after('reset environemnt variables', () => {
    process.env.NHSCHOICES_SYNDICATION_BASEURL = originalUrl;
    process.env.NHSCHOICES_SYNDICATION_APIKEY = originalApikey;
  });

  describe('urlForPharmacyPostcodeSearch', () => {
    it('should set the request Url for the pharmacy postcode search', () => {
      const location = 'postcode';
      const req = { query: { location } };
      const expectedUrl =
        `${baseUrl}/organisations/pharmacies/postcode/` +
        `${location}.xml?range=50&apikey=${apikey}`;

      urlUtils.urlForPharmacyPostcodeSearch(req, null, () => {});

      // eslint-disable-next-line no-unused-expressions
      expect(req.urlForPharmacy).is.not.null;
      expect(req.urlForPharmacy).to.be.equal(expectedUrl);
    });
  });
});
