const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const nock = require('nock');

const constants = require('../../app/lib/constants');
const getSampleResponse = require('../resources/getSampleResponse');
const iExpect = require('../lib/expectations');
const { postcodesIOURL } = require('../lib/constants');
const server = require('../../server');
const nockRequests = require('../lib/nockRequests');
const queryBuilder = require('../../app/lib/queryBuilder');
const postcodeCoordinates = require('../resources/postcode-coordinates');

const { expect } = chai;
const { queryTypes } = constants;

chai.use(chaiHttp);

const { siteRoot } = constants;
const resultsRoute = `${siteRoot}/results`;

function expectStandardMetadata($) {
  const canonicalUrl = `https://127.0.0.1${siteRoot}/`;
  expect($('link[rel="canonical"]').attr('href')).to.equal(canonicalUrl);
  expect($('meta[property="og:description"]').attr('content')).to.equal(constants.app.description);
  expect($('meta[property="og:image"]').attr('content')).to.equal(`${canonicalUrl}images/opengraph-image.png`);
  expect($('meta[property="og:image:alt"]').attr('content')).to.equal('nhs.uk');
  expect($('meta[property="og:image:height"]').attr('content')).to.equal('630');
  expect($('meta[property="og:image:width"]').attr('content')).to.equal('1200');
  expect($('meta[property="og:locale"]').attr('content')).to.equal(constants.app.locale);
  expect($('meta[property="og:site_name"]').attr('content')).to.equal(constants.app.siteName);
  expect($('meta[property="og:title"]').attr('content')).to.equal(`${constants.app.title} - NHS`);
  expect($('meta[property="og:type"]').attr('content')).to.equal('website');
  expect($('meta[property="og:url"]').attr('content')).to.equal(`https://127.0.0.1${siteRoot}/`);
  expect($('meta[property="twitter:card"]').attr('content')).to.equal('summary_large_image');
  expect($('meta[property="twitter:creator"]').attr('content')).to.equal('@nhsuk');
  expect($('meta[property="twitter:site"]').attr('content')).to.equal('@nhsuk');
}

describe('Metadata', () => {
  const location = 'Midsomer';

  afterEach('clean nock', () => {
    nock.cleanAll();
  });

  describe('the search page', () => {
    it('should include the standard properties', async () => {
      const res = await chai.request(server).get(siteRoot);
      iExpect.htmlWith200Status(res);
      const $ = cheerio.load(res.text);

      expectStandardMetadata($);
    });
  });

  describe('the results page, when displaying results', () => {
    it('should include the standard properties', async () => {
      const searchOrigin = postcodeCoordinates.LS1;
      const body = queryBuilder(searchOrigin, { queryType: queryTypes.nearby });
      await nockRequests.serviceSearch(body, 200, 'organisations/LS1-as.json');

      const res = await chai.request(server)
        .get(resultsRoute)
        .query({
          latitude: searchOrigin.latitude,
          location,
          longitude: searchOrigin.longitude,
        });
      iExpect.htmlWith200Status(res);
      const $ = cheerio.load(res.text);

      expectStandardMetadata($);
    });
  });

  describe('the results page, when there are no results', () => {
    it('should include the standard properties', async () => {
      const multiPlaceResponse = getSampleResponse('postcodesio-responses/multiplePlaceResult.json');
      const multiPlaceTerm = 'multiresult';

      nock(postcodesIOURL)
        .get(`/places?limit=100&q=${multiPlaceTerm}`)
        .times(1)
        .reply(200, multiPlaceResponse);

      const res = await chai.request(server)
        .get(resultsRoute)
        .query({ location: multiPlaceTerm });

      iExpect.htmlWith200Status(res);
      const $ = cheerio.load(res.text);

      expectStandardMetadata($);
    });
  });
});
