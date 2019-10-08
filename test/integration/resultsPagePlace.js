const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const nock = require('nock');

const constants = require('../../app/lib/constants');
const getSampleResponse = require('../resources/getSampleResponse');
const iExpect = require('../lib/expectations');
const postcodesIOURL = require('../lib/constants').postcodesIOURL;
const server = require('../../server');
const queryBuilder = require('../../app/lib/queryBuilder');
const nockRequests = require('../lib/nockRequests');

const expect = chai.expect;
const queryTypes = constants.queryTypes;

chai.use(chaiHttp);

const resultsRoute = `${constants.siteRoot}/results`;

describe('The place results page', () => {
  after('clean nock', () => {
    nock.cleanAll();
  });

  it('should return list of nearby pharmacies for unique place search', async () => {
    const singlePlaceResponse = getSampleResponse('postcodesio-responses/singlePlaceResult.json');
    const singleResult = JSON.parse(singlePlaceResponse).result[0];
    const saddr = `${singleResult.name_1}, ${singleResult.county_unitary}, ${singleResult.outcode}`;
    const searchTerm = 'oneresult';
    const numberOfResults = constants.api.nearbyResultsCount;

    nock(postcodesIOURL)
      .get('/places')
      .query({ limit: 100, q: searchTerm })
      .times(1)
      .reply(200, singlePlaceResponse);

    const searchOrigin = {
      latitude: singleResult.latitude,
      longitude: singleResult.longitude,
    };
    const body = queryBuilder(searchOrigin, { queryType: queryTypes.nearby });
    await nockRequests.serviceSearch(body, 200, 'organisations/LS1-as.json');

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
    const singleResult = JSON.parse(singlePlaceResponse).result[0];
    const searchOrigin = {
      latitude: singleResult.latitude,
      longitude: singleResult.longitude,
    };
    const saddr = `${singleResult.name_1}, ${singleResult.county_unitary}, ${singleResult.outcode}`;
    const searchTerm = 'oneresult';
    const numberOfResults = constants.api.openResultsCount;

    nock(postcodesIOURL)
      .get('/places')
      .query({ limit: 100, q: searchTerm })
      .times(1)
      .reply(200, singlePlaceResponse);

    const body = queryBuilder(searchOrigin, { queryType: queryTypes.openNearby });
    await nockRequests.serviceSearch(body, 200, 'organisations/LS1-as.json');

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
    expect($('h1').text()).to.equal(`We can't find '${noResultsTerm}'`);
    expect($('main').text()).to
      .contain('If the place you searched for is in England, you could:');
    expect($('main').text()).to.not
      .contain('If you need a pharmacy in Scotland, Wales, Northern Ireland or the Isle of Man, you can use one of the following websites.');
    expect($('main').text()).to.contain('Find pharmacies in Scotland on the NHS 24 website');
    expect($('main').text()).to.contain('Find pharmacies in Wales on the NHS Direct Wales website');
    expect($('main').text()).to.contain('Find pharmacies in Northern Ireland on the Health and Social Care website');
    iExpect.noResultsPageBreadcrumb($);
  });
});
