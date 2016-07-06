// const util = require('util');
const chai = require('chai');
const expect = chai.expect;
const nock = require('nock');
const getSampleResponse = require('./getSampleResponse');
const middleware = require('../../app/middleware/gp');
const daysOfTheWeek = require('../../app/utilities/constants').daysOfTheWeek;

describe('Middleware', () => {
  describe('getUrl(), when URL is set in environment variable', () => {
    let oldApiKey;
    let oldUrl;
    before('Set Syndication URL', () => {
      oldUrl = process.env.NHSCHOICES_SYNDICATION_URL;
      oldApiKey = process.env.NHSCHOICES_SYNDICATION_APIKEY;
      process.env.NHSCHOICES_SYNDICATION_URL =
        'http://test/%s?apikey=';
      process.env.NHSCHOICES_SYNDICATION_APIKEY = 'secret';
    });
    after('Unset Syndication URL', () => {
      process.env.NHSCHOICES_SYNDICATION_APIKEY = oldApiKey;
      process.env.NHSCHOICES_SYNDICATION_URL = oldUrl;
    });
    it('should return a url with API key for a specific gp practice', () => {
      const fakeRequest = {
        params: { gpId: '123456' },
      };

      middleware.getUrl(fakeRequest, {}, () => {});

      expect(fakeRequest.urlForGp).to.equal('http://test/123456?apikey=secret');
    });
  });
  describe('getOpeningTimes', () => {
    it('should return populated opening times for the practice', (done) => {
      const fakeRequest = {
        gpDetails: { overviewLink: 'http://test/test' },
      };
      nock('http://test')
        .get('/test')
        .reply(200, getSampleResponse('gp_overview'));

      middleware.getOpeningTimes(fakeRequest, {}, () => {
        expect(fakeRequest.gpDetails.openingTimes.reception).to.be.an('object');
        expect(fakeRequest.gpDetails.openingTimes.reception).to.have.keys(daysOfTheWeek);
        expect(fakeRequest.gpDetails.openingTimes.surgery).to.be.an('object');
        expect(fakeRequest.gpDetails.openingTimes.surgery).to.have.keys(daysOfTheWeek);
        done();
      });
    });
    it('should handle GP overview resource page not found', (done) => {
      const fakeRequest = {
        gpDetails: { overviewLink: 'http://test/test' },
      };
      nock('http://test')
        .get('/test')
        .reply(404);

      middleware.getOpeningTimes(fakeRequest, {}, (err) => {
        expect(err.message).to.equal('GP Opening Times Not Found');
        expect(err.status).to.equal(404);
        done();
      });
    });
    it('should handle server error', (done) => {
      const fakeRequest = {
        gpDetails: { overviewLink: 'http://test/test' },
      };
      nock('http://test')
        .get('/test')
        .reply(500);

      middleware.getOpeningTimes(fakeRequest, {}, (err) => {
        expect(err).to.equal('Error: 500');
        done();
      });
    });
  });
});
