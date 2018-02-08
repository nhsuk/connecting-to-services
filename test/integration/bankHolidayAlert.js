const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const nock = require('nock');

const constants = require('../../app/lib/constants');
const getSampleResponse = require('../resources/getSampleResponse');
const iExpect = require('../lib/expectations');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.SITE_ROOT}/results`;
const resultsCount = constants.api.nearbyResultsCount;
const yourLocation = constants.yourLocation;

describe('The bank holiday alert messaging', () => {
  after('clean nock', () => {
    nock.cleanAll();
  });

  afterEach('reset DATE', () => {
    process.env.DATE = '2017-12-12';
  });

  describe('on the day of the bank holiday', () => {
    before('set DATE', () => {
      process.env.DATE = '2017-12-25';
    });

    it('should show a message about the bank holiday for each result that is open', async () => {
      const reverseGeocodeResponse = getSampleResponse('postcodesio-responses/reverseGeocodeEngland.json');
      const serviceApiResponse = getSampleResponse('service-api-responses/-1,54.json');
      const latitude = 52.75;
      const longitude = -1.55;

      nock('https://api.postcodes.io')
        .get('/postcodes')
        .query({
          limit: 1, radius: 20000, wideSearch: true, lon: longitude, lat: latitude
        })
        .times(1)
        .reply(200, reverseGeocodeResponse);

      nock(process.env.API_BASE_URL)
        .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results=${resultsCount}`)
        .times(1)
        .reply(200, serviceApiResponse);

      const res = await chai.request(server)
        .get(resultsRoute)
        .query({ location: yourLocation, latitude, longitude });

      iExpect.htmlWith200Status(res);
      const $ = cheerio.load(res.text);

      expect($('.callout--warning').length).to.equal(10);
      $('callout--warning').toArray().forEach((item) => {
        expect(item.text()).to.equal('Today is a bank holiday. Please call to check opening times.');
      });
    });
  });
});
