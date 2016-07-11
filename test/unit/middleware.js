const chai = require('chai');
const expect = chai.expect;
const assert = require('assert');
const nock = require('nock');
const getSampleResponse = require('./lib/getSampleResponse');
const middleware = require('../../app/middleware/gp');
const daysOfTheWeek = require('../../app/lib/constants').daysOfTheWeek;

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
  describe('getGpDetails', () => {
    describe('Invalid URL', () => {
      it('should disallow empty URLs', (done) => {
        ['', null, undefined].forEach(
          (url) => expect(() => { middleware.getDetails({ urlForGp: url }, {}, () => {}); })
          .to.throw(assert.AssertionError)
          .with.property('message', `Invalid URL: \'${url}\'`));
        done();
      });
    });
    describe('Valid URL', () => {
      const fakeRequest = {
        urlForGp: 'http://test/test',
      };
      it('should return populated gp details for the practice', (done) => {
        nock('http://test')
          .get('/test')
          .reply(200, getSampleResponse('gp_practice_by_ods_code'));

        middleware.getDetails(fakeRequest, {}, () => {
          expect(typeof(fakeRequest.gpDetails)).to.not.equal('undefined');
          expect(typeof(fakeRequest.gpDetails)).to.not.equal(null);
          expect(fakeRequest.gpDetails).to.have.keys(['name', 'address', 'overviewLink']);
          expect(fakeRequest.gpDetails.address).to.have.keys(
            ['line1', 'line2', 'line3', 'line4', 'postcode']);
          done();
        });
      });
      it('should handle GP overview resource page not found', (done) => {
        nock('http://test')
          .get('/test')
          .reply(404);

        middleware.getDetails(fakeRequest, {}, (err) => {
          expect(err.message).to.equal('GP Not Found');
          expect(err.status).to.equal(404);
          done();
        });
      });
      it('should handle server error', (done) => {
        nock('http://test')
          .get('/test')
          .reply(500);

        middleware.getDetails(fakeRequest, {}, (err) => {
          expect(err).to.equal('Error: 500');
          done();
        });
      });
      it('should handle http error', (done) => {
        nock('http://test')
          .get('/test')
          .replyWithError('Error');

        middleware.getDetails(fakeRequest, {}, (err) => {
          expect(err.message).to.equal('Error');
          done();
        });
      });
    });
  });
  describe('getOpeningTimes', () => {
    const fakeRequest = {
      gpDetails: { overviewLink: 'http://test/test' },
    };
    it('should return populated opening times for the practice', (done) => {
      nock('http://test')
        .get('/test')
        .reply(200, getSampleResponse('gp_overview'));

      middleware.getOpeningTimes(fakeRequest, {}, () => {
        const receptionOpeningTimes = fakeRequest.gpDetails.openingTimes.reception;
        const surgeryOpeningTimes = fakeRequest.gpDetails.openingTimes.surgery;
        expect(typeof(receptionOpeningTimes)).to.not.equal('undefined');
        expect(receptionOpeningTimes).to.not.equal(null);
        expect(receptionOpeningTimes).to.have.keys(daysOfTheWeek);
        expect(typeof(surgeryOpeningTimes)).to.not.equal('undefined');
        expect(surgeryOpeningTimes).to.not.equal(null);
        expect(surgeryOpeningTimes).to.have.keys(daysOfTheWeek);
        done();
      });
    });
    it('should handle GP overview resource page not found', (done) => {
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
      nock('http://test')
        .get('/test')
        .reply(500);

      middleware.getOpeningTimes(fakeRequest, {}, (err) => {
        expect(err).to.equal('Error: 500');
        done();
      });
    });
    it('should handle http error', (done) => {
      nock('http://test')
        .get('/test')
        .replyWithError('Error');

      middleware.getOpeningTimes(fakeRequest, {}, (err) => {
        expect(err.message).to.equal('Error');
        done();
      });
    });
  });
});
