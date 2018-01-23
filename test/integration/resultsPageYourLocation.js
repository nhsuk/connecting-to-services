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
const yourLocation = constants.yourLocation;

describe(`The ${yourLocation} results page`, () => {
  it('should return a list of nearby pharmacies (by default) for an English location', (done) => {
    const reverseGeocodeResponse = getSampleResponse('postcodesio-responses/reverseGeocodeEngland.json');
    const serviceApiResponse = getSampleResponse('service-api-responses/-1,54.json');
    const latitude = 52.75;
    const longitude = -1.25;
    const numberOfResults = constants.api.nearbyResultsCount;

    nock('https://api.postcodes.io')
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

    chai.request(server)
      .get(resultsRoute)
      .query({ location: yourLocation, latitude, longitude })
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);
        const $ = cheerio.load(res.text);
        const results = $('.results__item');

        expect($('h1').text())
          .to.equal(`Pharmacies near ${yourLocation}`);
        expect(results.length).to.equal(numberOfResults);
        iExpect.resultsPageBreadcrumb($);

        const mapLinks = $('.results__maplink');
        mapLinks.toArray().forEach((link) => {
          expect($(link).attr('href')).to.have.string(`https://maps.google.com/maps?saddr=${latitude}%2C${longitude}`);
        });

        done();
      });
  });

  it('should return a list of open pharmacies for an English location', (done) => {
    const reverseGeocodeResponse = getSampleResponse('postcodesio-responses/reverseGeocodeEngland.json');
    const serviceApiResponse = getSampleResponse('service-api-responses/-1,54.json');
    const latitude = 52.75;
    const longitude = -1.25;
    const numberOfResults = constants.api.openResultsCount;

    nock('https://api.postcodes.io')
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

    chai.request(server)
      .get(resultsRoute)
      .query({
        location: yourLocation, latitude, longitude, open: true
      })
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);
        const $ = cheerio.load(res.text);
        const results = $('.results__item');

        expect($('h1').text()).to.equal(`Pharmacies near ${yourLocation}`);
        expect(results.length).to.equal(numberOfResults);
        iExpect.resultsPageBreadcrumb($);

        const mapLinks = $('.results__maplink');
        mapLinks.toArray().forEach((link) => {
          expect($(link).attr('href')).to.have.string(`https://maps.google.com/maps?saddr=${latitude}%2C${longitude}`);
        });

        done();
      });
  });

  it('should return the \'no results\' page for a location with a known postcode e.g. somewhere in Scotland', (done) => {
    const reverseGeocodeResponse = getSampleResponse('postcodesio-responses/reverseGeocodeScotland.json');
    const latitude = 55;
    const longitude = -4;

    nock('https://api.postcodes.io')
      .get('/postcodes')
      .query({
        limit: 1, radius: 20000, wideSearch: true, lon: longitude, lat: latitude
      })
      .times(1)
      .reply(200, reverseGeocodeResponse);

    chai.request(server)
      .get(resultsRoute)
      .query({ location: yourLocation, latitude, longitude })
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);
        const $ = cheerio.load(res.text);

        expect($('.results__header--none').text()).to.be.equal('We can\'t find any pharmacies near your location');
        expect($('.results__none-content p').length).to.be.equal(2);
        expect($('.results__none-content p a').text()).to.equal('Find pharmacies in Scotland on the NHS 24 website');
        iExpect.noResultsPageBreadcrumb($);
        done();
      });
  });

  it('should return the \'no results\' page for a coordinate with no result from the reverse lookup', (done) => {
    const reverseGeocodeResponse = getSampleResponse('postcodesio-responses/reverseGeocodeUnknown.json');
    const latitude = 1;
    const longitude = 1;

    nock('https://api.postcodes.io')
      .get('/postcodes')
      .query({
        limit: 1, radius: 20000, wideSearch: true, lon: longitude, lat: latitude
      })
      .times(1)
      .reply(200, reverseGeocodeResponse);

    chai.request(server)
      .get(resultsRoute)
      .query({ location: yourLocation, latitude, longitude })
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);
        const $ = cheerio.load(res.text);

        expect($('.results__header--none').text()).to.be.equal('We can\'t find any pharmacies near your location');
        expect($('.results__none-content').text()).to
          .contain('This service only provides information about pharmacies in England.');
        expect($('.results__none-content').text()).to.not
          .contain('If you need a pharmacy in Scotland, Wales, Northern Ireland or the Isle of Man, you can use one of the following websites.');
        expect($('.results__none-content p').length).to.be.equal(4);
        iExpect.noResultsPageBreadcrumb($);
        done();
      });
  });
});
