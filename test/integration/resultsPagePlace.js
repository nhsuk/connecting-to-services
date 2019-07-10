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

const resultsRoute = `${constants.SITE_ROOT}/results`;

describe('The place results page', () => {
  after('clean nock', () => {
    nock.cleanAll();
  });

  it('should return list of nearby pharmacies for unique place search', async () => {
    const singlePlaceResponse = getSampleResponse('postcodesio-responses/singlePlaceResult.json');
    const serviceApiResponse = getSampleResponse('service-api-responses/-1,54.json');
    const singleResult = JSON.parse(singlePlaceResponse).result[0];
    const latitude = singleResult.latitude;
    const longitude = singleResult.longitude;
    const saddr = `${singleResult.name_1}, ${singleResult.county_unitary}, ${singleResult.outcode}`;
    const searchTerm = 'oneresult';
    const numberOfResults = constants.api.nearbyResultsCount;

    nock(postcodesIOURL)
      .get('/places')
      .query({ limit: 100, q: searchTerm })
      .times(1)
      .reply(200, singlePlaceResponse);

    nock(process.env.API_BASE_URL)
      .get('/nearby')
      .query({ latitude, 'limits:results': numberOfResults, longitude })
      .times(1)
      .reply(200, serviceApiResponse);

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({ location: searchTerm });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    iExpect.midsomerNortonResults($, saddr, numberOfResults);
    iExpect.resultsPageBreadcrumb($);
  });

  it('should return list of open pharmacies for unique place search', async () => {
    const singlePlaceResponse = getSampleResponse('postcodesio-responses/singlePlaceResult.json');
    const serviceApiResponse = getSampleResponse('service-api-responses/-1,54.json');
    const singleResult = JSON.parse(singlePlaceResponse).result[0];
    const latitude = singleResult.latitude;
    const longitude = singleResult.longitude;
    const saddr = `${singleResult.name_1}, ${singleResult.county_unitary}, ${singleResult.outcode}`;
    const searchTerm = 'oneresult';
    const numberOfResults = constants.api.openResultsCount;

    nock(postcodesIOURL)
      .get('/places')
      .query({ limit: 100, q: searchTerm })
      .times(1)
      .reply(200, singlePlaceResponse);

    nock(process.env.API_BASE_URL)
      .get('/open')
      .query({ latitude, 'limits:results': numberOfResults, longitude })
      .times(1)
      .reply(200, serviceApiResponse);

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({ location: searchTerm, open: true });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    iExpect.midsomerNortonResults($, saddr, numberOfResults);
    iExpect.resultsPageBreadcrumb($);
  });

  it('should return no results page with exact term displayed, and links for Scotland, Wales and NI for unknown place search', async () => {
    const noResultsTerm = '@noresults@';
    const noResultsTermClean = 'noresults';
    nock(postcodesIOURL)
      .get('/places')
      .query({ limit: 100, q: noResultsTermClean })
      .times(1)
      .reply(200, { result: [], status: 200 });

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({ location: noResultsTerm });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expect($('.results__header--none').text()).to.equal(`We can't find '${noResultsTerm}'`);
    expect($('.results__none-content').text()).to
      .contain('If the place you searched for is in England, you could:');
    expect($('.results__none-content').text()).to.not
      .contain('If you need a pharmacy in Scotland, Wales, Northern Ireland or the Isle of Man, you can use one of the following websites.');
    expect($('.results__none-content p').text()).to.contain('Find pharmacies in Scotland on the NHS 24 website');
    expect($('.results__none-content p').text()).to.contain('Find pharmacies in Wales on the NHS Direct Wales website');
    expect($('.results__none-content p').text()).to.contain('Find pharmacies in Northern Ireland on the Health and Social Care website');
    expect($('.results-none-nearby').length).to.equal(0);
    iExpect.noResultsPageBreadcrumb($);
  });
});
