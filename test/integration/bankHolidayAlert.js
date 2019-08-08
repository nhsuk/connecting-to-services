const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const nock = require('nock');

const constants = require('../../app/lib/constants');
const getSampleResponse = require('../resources/getSampleResponse');
const iExpect = require('../lib/expectations');
const nockRequests = require('../lib/nockRequests');
const postcodesIOURL = require('../lib/constants').postcodesIOURL;
const server = require('../../server');
const queryBuilder = require('../../app/lib/queryBuilder');

const expect = chai.expect;
const queryTypes = constants.queryTypes;

chai.use(chaiHttp);

const resultsRoute = `${constants.siteRoot}/results`;
const yourLocation = constants.yourLocation;

describe('The bank holiday alert messaging', () => {
  after('clean nock', () => {
    nock.cleanAll();
  });

  afterEach('reset DATETIME', () => {
    process.env.DATETIME = '2017-12-12T12:00:00';
  });

  describe('on the day of the bank holiday', () => {
    before('set DATETIME', () => {
      process.env.DATETIME = '2017-12-25T12:00:00';
    });

    it('should show a message about the bank holiday for each result that is open', async () => {
      const reverseGeocodeResponse = getSampleResponse('postcodesio-responses/reverseGeocodeEngland.json');
      const latitude = 53.7975673878326;
      const longitude = -1.55183371292776;
      const searchOrigin = { latitude, longitude };
      nock(postcodesIOURL)
        .get('/postcodes')
        .query({
          lat: latitude, limit: 1, lon: longitude, radius: 20000, wideSearch: true,
        })
        .times(1)
        .reply(200, reverseGeocodeResponse);

      const body = queryBuilder(searchOrigin, { queryType: queryTypes.openNearby });

      nockRequests.serviceSearch(body, 200, 'organisations/LS1-as.json');

      const res = await chai.request(server)
        .get(resultsRoute)
        .query({ latitude, location: yourLocation, longitude });

      iExpect.htmlWith200Status(res);
      const $ = cheerio.load(res.text);

      const warnings = $('.callout--warning');
      expect(warnings.length).to.equal(10);
      warnings.toArray().forEach((item) => {
        expect($(item).text()).to.equal('Today is a bank holiday. Please call to check opening times.');
      });
    });
  });
});
