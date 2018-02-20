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

function expectSearchAgainPage($) {
  expect($('.error-summary-heading').text())
    .to.contain('You must enter a town, city or postcode to find a pharmacy.');
  expect($('.form-label-bold').text()).to.equal('Enter a town, city or postcode in England');
}

function expectMidsomerNortonResults($, location, numberOfResults) {
  expect($('h1').text()).to.equal('Pharmacies near Midsomer Norton');

  const results = $('.results__item');
  expect(results.length).to.equal(numberOfResults);

  const mapLinks = $('.maplink');
  expect(mapLinks.length).to.equal(10);
  mapLinks.toArray().forEach((link) => {
    expect($(link).attr('href')).to.have.string('https://maps.google.com/maps?saddr=&');
  });

  const choicesServicesLinks = $('.serviceslink');
  expect(choicesServicesLinks.length).to.equal(10);
  choicesServicesLinks.toArray().forEach((link) => {
    expect($(link).attr('href')).to.have.string('https://www.nhs.uk/Services/pharmacies/PctServices/DefaultView.aspx');
  });
  expect(choicesServicesLinks.length).to.equal(numberOfResults);
  expect($('title').text()).to.equal('Pharmacies near Midsomer Norton - NHS.UK');
}

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

    nock('https://api.postcodes.io')
      .get(`/places?q=${searchTerm}&limit=100`)
      .times(1)
      .reply(200, singlePlaceResponse);

    nock(process.env.API_BASE_URL)
      .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results=${numberOfResults}`)
      .times(1)
      .reply(200, serviceApiResponse);

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({ location: searchTerm });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expectMidsomerNortonResults($, saddr, numberOfResults);
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

    nock('https://api.postcodes.io')
      .get(`/places?q=${searchTerm}&limit=100`)
      .times(1)
      .reply(200, singlePlaceResponse);

    nock(process.env.API_BASE_URL)
      .get(`/open?latitude=${latitude}&longitude=${longitude}&limits:results=${numberOfResults}`)
      .times(1)
      .reply(200, serviceApiResponse);

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({ location: searchTerm, open: true });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expectMidsomerNortonResults($, saddr, numberOfResults);
    iExpect.resultsPageBreadcrumb($);
  });

  it('should return disambiguation page for non unique place search', async () => {
    const multiPlaceResponse = getSampleResponse('postcodesio-responses/multiplePlaceResult.json');
    const multiPlaceTerm = 'multiresult';
    nock('https://api.postcodes.io')
      .get(`/places?q=${multiPlaceTerm}&limit=100`)
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

    expect($('title').text()).to.equal('Find a pharmacy - Places that match \'multiresult\' - NHS.UK');
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
      .query({ location, latitude, longitude });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expectMidsomerNortonResults($, location, numberOfResults);
    iExpect.resultsPageBreadcrumb($);
  });

  it('should return search page for empty search', async () => {
    const res = await chai.request(server)
      .get(resultsRoute)
      .query({ location: '' });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expectSearchAgainPage($);
    expect($('title').text()).to.equal('Find a pharmacy - Enter a town, city or postcode, or use your location - NHS.UK');
  });

  it('should return no results page with exact term displayed, and links for Scotland, Wales and NI for unknown place search', async () => {
    const noResultsTerm = '@noresults@';
    const noResultsTermClean = 'noresults';
    nock('https://api.postcodes.io')
      .get(`/places?q=${noResultsTermClean}&limit=100`)
      .times(1)
      .reply(200, { status: 200, result: [] });

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

  it('should return search page for non-alphanumeric search', async () => {
    const res = await chai.request(server)
      .get(resultsRoute)
      .query({ location: '!@£$%' });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expectSearchAgainPage($);
    expect($('title').text()).to.equal('Find a pharmacy - We can\'t find the postcode \'!@£$%\' - NHS.UK');
  });
});
