const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const nock = require('nock');
const server = require('../../server');
const constants = require('../../app/lib/constants');
const getSampleResponse = require('../resources/getSampleResponse');
const iExpect = require('../lib/expectations');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.SITE_ROOT}/results`;

describe('The results page', () => {
  after('clean nock', () => {
    nock.cleanAll();
  });

  it('should return distance away singularly for 1 mile and pluraly for other distances', (done) => {
    const serviceApiResponse = getSampleResponse('service-api-responses/-1,54.json');
    const location = 'Midsomer Norton, Bath and North East Somerset, BA3';
    const latitude = 54;
    const longitude = -1;
    const numberOfResults = constants.api.nearbyResultsCount;

    nock(process.env.API_BASE_URL)
      .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results=${numberOfResults}`)
      .times(1)
      .reply(200, serviceApiResponse);

    chai.request(server)
      .get(resultsRoute)
      .query({ location, latitude, longitude })
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);
        const $ = cheerio.load(res.text);
        expect($('.distance').eq(0).text()).to.equal('0 miles away');
        expect($('.distance').eq(4).text()).to.equal('1 mile away');
        done();
      });
  });
});
