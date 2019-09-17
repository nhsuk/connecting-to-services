const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const nock = require('nock');

const constants = require('../../../app/lib/constants');
const getSampleResponse = require('../resources/getSampleResponse');
const iExpect = require('../lib/expectations');
const postcodesIOURL = require('../lib/constants').postcodesIOURL;
const server = require('../../../server');
const nockRequests = require('../lib/nockRequests');
const queryBuilder = require('../../../app/lib/queryBuilder');

const queryTypes = constants.queryTypes;
const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.siteRoot}/results`;
const yourLocation = constants.yourLocation;

function setupPostcodesIoNock(country) {
  const reverseGeocodeResponse = getSampleResponse(`postcodesio-responses/reverseGeocode${country}.json`);
  const reverseGeocodeResponseResult = JSON.parse(reverseGeocodeResponse).result;
  const searchOrigin = {
    latitude: reverseGeocodeResponseResult ? reverseGeocodeResponseResult[0].latitude : 1,
    longitude: reverseGeocodeResponseResult ? reverseGeocodeResponseResult[0].longitude : 1,
  };

  nock(postcodesIOURL)
    .get('/postcodes')
    .query({
      lat: searchOrigin.latitude,
      limit: 1,
      lon: searchOrigin.longitude,
      radius: 20000,
      wideSearch: true,
    })
    .times(1)
    .reply(200, reverseGeocodeResponse);

  return searchOrigin;
}

describe(`The ${yourLocation} results page`, () => {
  it('should return a list of nearby pharmacies (by default) for an English location', async () => {
    const searchOrigin = setupPostcodesIoNock('England');

    const body = queryBuilder(searchOrigin, { queryType: queryTypes.nearby });
    await nockRequests.serviceSearch(body, 200, 'organisations/LS1-as.json');

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({
        latitude: searchOrigin.latitude,
        location: yourLocation,
        longitude: searchOrigin.longitude,
      });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    const results = $('.results__item');

    expect($('h1').text())
      .to.equal(`Pharmacies near ${yourLocation}`);
    expect(results.length).to.equal(10);
    iExpect.resultsPageBreadcrumb($);

    const mapLinks = $('.maplink');
    expect(mapLinks.length).to.equal(10);
    mapLinks.toArray().forEach((link) => {
      expect($(link).attr('href')).to.have.string('https://maps.google.com/maps?daddr=');
      expect($(link).attr('href')).to.have.string(`&saddr=${searchOrigin.latitude}%2C${searchOrigin.longitude}`);
    });
  });

  it('should return a list of open pharmacies for an English location', async () => {
    const searchOrigin = setupPostcodesIoNock('England');
    const body = queryBuilder(searchOrigin, { queryType: queryTypes.openNearby });
    await nockRequests.serviceSearch(body, 200, 'organisations/LS1-as.json');

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({
        latitude: searchOrigin.latitude,
        location: yourLocation,
        longitude: searchOrigin.longitude,
        open: true,
      });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    const results = $('.results__item');

    expect($('h1').text()).to.equal(`Pharmacies near ${yourLocation}`);
    expect(results.length).to.equal(10);
    iExpect.resultsPageBreadcrumb($);

    const mapLinks = $('.maplink');
    expect(mapLinks.length).to.equal(10);
    mapLinks.toArray().forEach((link) => {
      expect($(link).attr('href')).to.have.string('https://maps.google.com/maps?daddr=');
      expect($(link).attr('href')).to.have.string(`&saddr=${searchOrigin.latitude}%2C${searchOrigin.longitude}`);
    });
  });

  it('should return the \'no results\' page for a location with a known postcode e.g. somewhere in Scotland', async () => {
    const searchOrigin = setupPostcodesIoNock('Scotland');

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({
        latitude: searchOrigin.latitude,
        location: yourLocation,
        longitude: searchOrigin.longitude,
      });
    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($('.results__header--none').text()).to.equal('We can\'t find any pharmacies near your location');
    expect($('.results__none-content p').length).to.equal(2);
    expect($('.results__none-content p a').text()).to.equal('Find pharmacies in Scotland on the NHS 24 website');
    iExpect.noResultsPageBreadcrumb($);
  });

  it('should return the \'no results\' page for a coordinate with no result from the reverse lookup', async () => {
    const searchOrigin = setupPostcodesIoNock('Unknown');

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({
        latitude: searchOrigin.latitude,
        location: yourLocation,
        longitude: searchOrigin.longitude,
      });

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
