const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const nock = require('nock');

const constants = require('../../app/lib/constants');
const getSampleResponse = require('../resources/getSampleResponse');
const iExpect = require('../lib/expectations');
const postcodesIOURL = require('../lib/constants').postcodesIOURL;
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.siteRoot}/results`;

describe('The place results page', () => {
  after('clean nock', () => {
    nock.cleanAll();
  });

  it('should return disambiguation page for non unique place search', async () => {
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

    expect($('.results__item').length).to.equal(3);
    expect($('.results__none').length).to.equal(1);
    expect($('.places > h1').text())
      .to.include(`We found 3 places that match '${multiPlaceTerm}'`);

    expect($('head title').text()).to.equal(`${constants.app.title} - Places that match 'multiresult' - NHS`);
    iExpect.disambiguationPageBreadcrumb($, multiPlaceTerm);
  });

  it('should return nearby results page for link clicked from disambiguation page', async () => {
    const serviceApiResponse = getSampleResponse('service-api-responses/-1,54.json');
    const location = 'Midsomer Norton, Bath and North East Somerset, BA3';
    const latitude = 54;
    const longitude = -1;
    const numberOfResults = constants.api.nearbyResultsCount;

    nock(process.env.API_BASE_URL)
      .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results=${numberOfResults}`)
      .times(1)
      .reply(200, serviceApiResponse);

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({ latitude, location, longitude });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    iExpect.midsomerNortonResults($, location, numberOfResults);
    iExpect.resultsPageBreadcrumb($);
  });
});
