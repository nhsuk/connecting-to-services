const chai = require('chai');
const expect = chai.expect;
const AssertionError = require('assert').AssertionError;
const nock = require('nock');
const getSampleResponse = require('./lib/getSampleResponse');
const cache = require('memory-cache');
const middleware = require('../../app/middleware/gp');
const daysOfTheWeek = require('../../app/lib/constants').daysOfTheWeek;

describe('Middleware', () => {
  describe('getUrl', () => {
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
          .to.throw(AssertionError, `Invalid URL: \'${url}\'`));
        done();
      });
    });
    describe('Valid URL', () => {
      const fakeRequest = {
        urlForGp: 'http://test/test',
      };
      it('should return populated gp practice details', (done) => {
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
      it('should handle gp not found', (done) => {
        nock('http://test')
          .get('/test')
          .reply(404);

        middleware.getDetails(fakeRequest, {}, (err) => {
          expect(err.message).to.equal('GP Not Found');
          expect(err.statusCode).to.equal(404);
          done();
        });
      });
      it('should handle syndication HTTP error', (done) => {
        nock('http://test')
          .get('/test')
          .reply(500);

        middleware.getDetails(fakeRequest, {}, (err) => {
          expect(err.message).to.equal('Syndication HTTP Error');
          expect(err.statusCode).to.equal(500);
          done();
        });
      });
      it('should handle syndication server error', (done) => {
        nock('http://test')
          .get('/test')
          .replyWithError('Server Error');

        middleware.getDetails(fakeRequest, {}, (err) => {
          expect(err.message).to.equal('Syndication Server Error: Server Error');
          expect(err.statusCode).to.equal(500);
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
    it('should return populated opening times for the pharmacy', (done) => {
      const fakePharmacyRequest = {
        pharmacyList: [{ id: '0/1' }],
      };
      nock('http://v1.syndication.nhschoices.nhs.uk')
        .get(/\/organisations\/pharmacies\/1\/overview.xml\?apikey=[a-z]*/)
        .reply(200, getSampleResponse('pharmacy_opening_times'));

      middleware.getPharmacyOpeningTimes(fakePharmacyRequest, {}, () => {
        expect(fakePharmacyRequest.pharmacyList[0].openingTimes.today[0].toTime)
          .to.not.equal(null);
        // TODO: if we still need this need a way to fake Date.now to prevent
        // the test from failing depending on the time of day.
        // expect(fakeRequest.pharmacyList[0].openNow).to.equal(false);
        done();
      });
    });
    it('should handle gp overview resource not found', (done) => {
      nock('http://test')
        .get('/test')
        .reply(404);

      middleware.getOpeningTimes(fakeRequest, {}, (err) => {
        expect(err.message).to.equal('GP Practice Opening Times Not Found');
        expect(err.statusCode).to.equal(404);
        done();
      });
    });
    it('should handle syndication http error', (done) => {
      nock('http://test')
        .get('/test')
        .reply(500);

      middleware.getOpeningTimes(fakeRequest, {}, (err) => {
        expect(err.message).to.equal('Syndication HTTP Error');
        expect(err.statusCode).to.equal(500);
        done();
      });
    });
    it('should handle syndication server error', (done) => {
      nock('http://test')
        .get('/test')
        .replyWithError('Server Error');

      middleware.getOpeningTimes(fakeRequest, {}, (err) => {
        expect(err.message).to.equal('Syndication Server Error: Server Error');
        expect(err.statusCode).to.equal(500);
        done();
      });
    });
  });
  describe('upperCaseGpId', () => {
    it('should upper case the gpId param', () => {
      const req = { params: { gpId: 'abc' } };
      middleware.upperCaseGpId(req, {}, () => {});
      expect(req.params.gpId).to.equal('ABC');
    });
  });
  describe('getBookOnlineUrl', () => {
    const gpId = '123456';
    const bookOnlineUrl = 'http://web.site/';
    before('add book_online_url to cache', () => {
      cache.put(gpId, { book_online_url: bookOnlineUrl });
    });
    it('should add bookOnlineUrl for gp requested', () => {
      const fakeRequest = {
        params: { gpId },
        gpDetails: {},
      };

      middleware.getBookOnlineUrl(fakeRequest, {}, () => {});
      expect(fakeRequest.gpDetails.bookOnlineUrl)
        .to.equal(bookOnlineUrl);
    });
  });
});
