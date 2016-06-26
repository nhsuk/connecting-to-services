const assert = require('chai').assert;
const ControllerUtils = require('../../app/utils/controller-utils.js');
const nock = require('nock');

describe('ControllerUtils (Unit)', () => {
  describe('getSyndicationUrl(), when URL is set in environment variable', () => {
    let oldValue;
    before('Set Syndication URL', () => {
      oldValue = process.env.NHSCHOICES_SYNDICATION_URL;
      process.env.NHSCHOICES_SYNDICATION_URL =
        'http://test/%s?apikey=secret';
    });
    after('Unset Syndication URL', () => {
      process.env.NHSCHOICES_SYNDICATION_URL = oldValue;
    });
    it('should return a url with API key for a specific gp practice', () => {
      const fakeRequest = {
        params: { gpId: '123456' },
      };

      assert.equal(
        ControllerUtils.getSyndicationUrl(fakeRequest),
        'http://test/123456?apikey=secret');
    });
  });

  describe('getGpDetails', () => {
    it('should return GP details from syndication server', (done) => {
      nock('http://www.example.com')
        .get('/resource')
        .reply(200, '{ "Name": "Bob Smith" }');

      const url = 'http://www.example.com/resource';

      ControllerUtils.getGpDetails(url, (response) => {
        assert.equal(response.Name, 'Bob Smith');
        assert.equal(response.statusCode, 200);
        done();
      });
    });
    it('should return 500 if syndication server return 500', (done) => {
      nock('http://www.example.com')
        .get('/resource')
        .reply(500, '{}');

      const url = 'http://www.example.com/resource';

      ControllerUtils.getGpDetails(url, (response) => {
        assert.equal(response.statusCode, 500);
        assert.equal(response.Name, undefined);
        done();
      });
    });
    it('should return 500 if syndication server errors', (done) => {
      nock('http://www.example.com')
        .get('/resource')
        .replyWithError('something awful happened');

      const url = 'http://www.example.com/resource';

      ControllerUtils.getGpDetails(url, (response) => {
        assert.equal(response.statusCode, 500);
        assert.equal(response.Name, undefined);
        done();
      });
    });
  });
});
