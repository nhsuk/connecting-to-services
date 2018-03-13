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
const yourLocation = constants.yourLocation;

describe(`The ${yourLocation} results page`, () => {
  it('should return a list of nearby pharmacies (by default) for an English location', async () => {
    const reverseGeocodeResponse = getSampleResponse('postcodesio-responses/reverseGeocodeEngland.json');
    const serviceApiResponse = getSampleResponse('service-api-responses/-1,54.json');
    const latitude = 52.75;
    const longitude = -1.25;
    const numberOfResults = constants.api.nearbyResultsCount;

    nock(postcodesIOURL)
      .get('/postcodes')
      .query({
        limit: 1, radius: 20000, wideSearch: true, lon: longitude, lat: latitude
      })
      .times(1)
      .reply(200, reverseGeocodeResponse);

    nock(process.env.API_BASE_URL)
      .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results=${numberOfResults}`)
      .times(1)
      .reply(200, serviceApiResponse);

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({ location: yourLocation, latitude, longitude });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    const results = $('.results__item');

    expect($('h1').text())
      .to.equal(`Pharmacies near ${yourLocation}`);
    expect(results.length).to.equal(numberOfResults);
    iExpect.resultsPageBreadcrumb($);

    const mapLinks = $('.maplink');
    expect(mapLinks.length).to.equal(10);
    mapLinks.toArray().forEach((link) => {
      expect($(link).attr('href')).to.have.string(`https://maps.google.com/maps?saddr=${latitude}%2C${longitude}`);
    });
  });

  it('should return a list of open pharmacies for an English location', async () => {
    const reverseGeocodeResponse = getSampleResponse('postcodesio-responses/reverseGeocodeEngland.json');
    const serviceApiResponse = getSampleResponse('service-api-responses/-1,54.json');
    const latitude = 52.75;
    const longitude = -1.25;
    const numberOfResults = constants.api.openResultsCount;

    nock(postcodesIOURL)
      .get('/postcodes')
      .query({
        limit: 1, radius: 20000, wideSearch: true, lon: longitude, lat: latitude
      })
      .times(1)
      .reply(200, reverseGeocodeResponse);

    nock(process.env.API_BASE_URL)
      .get(`/open?latitude=${latitude}&longitude=${longitude}&limits:results=${numberOfResults}`)
      .times(1)
      .reply(200, serviceApiResponse);

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({
        location: yourLocation, latitude, longitude, open: true
      });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    const results = $('.results__item');

    expect($('h1').text()).to.equal(`Pharmacies near ${yourLocation}`);
    expect(results.length).to.equal(numberOfResults);
    iExpect.resultsPageBreadcrumb($);

    const mapLinks = $('.maplink');
    expect(mapLinks.length).to.equal(10);
    mapLinks.toArray().forEach((link) => {
      expect($(link).attr('href')).to.have.string(`https://maps.google.com/maps?saddr=${latitude}%2C${longitude}`);
    });
  });

  it('should return the \'no results\' page for a location with a known postcode e.g. somewhere in Scotland', async () => {
    const reverseGeocodeResponse = getSampleResponse('postcodesio-responses/reverseGeocodeScotland.json');
    const latitude = 55;
    const longitude = -4;

    nock(postcodesIOURL)
      .get('/postcodes')
      .query({
        limit: 1, radius: 20000, wideSearch: true, lon: longitude, lat: latitude
      })
      .times(1)
      .reply(200, reverseGeocodeResponse);

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({ location: yourLocation, latitude, longitude });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($('.results__header--none').text()).to.equal('We can\'t find any pharmacies near your location');
    expect($('.results__none-content p').length).to.equal(2);
    expect($('.results__none-content p a').text()).to.equal('Find pharmacies in Scotland on the NHS 24 website');
    iExpect.noResultsPageBreadcrumb($);
  });

  it('should return the \'no results\' page for a coordinate with no result from the reverse lookup', async () => {
    const reverseGeocodeResponse = getSampleResponse('postcodesio-responses/reverseGeocodeUnknown.json');
    const latitude = 1;
    const longitude = 1;

    nock(postcodesIOURL)
      .get('/postcodes')
      .query({
        limit: 1, radius: 20000, wideSearch: true, lon: longitude, lat: latitude
      })
      .times(1)
      .reply(200, reverseGeocodeResponse);

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({ location: yourLocation, latitude, longitude });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($('.results__header--none').text()).to.equal('We can\'t find any pharmacies near your location');
    expect($('.results__none-content').text()).to
      .contain('This service only provides information about pharmacies in England.');
    expect($('.results__none-content').text()).to.not
      .contain('If you need a pharmacy in Scotland, Wales, Northern Ireland or the Isle of Man, you can use one of the following websites.');
    expect($('.results__none-content p').length).to.equal(4);
    iExpect.noResultsPageBreadcrumb($);
  });
});
