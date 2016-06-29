const assert = require('chai').assert;
const middleware = require('../../app/middleware/gp-practice');

describe('Middleware', () => {
  describe('getGpUrl(), when URL is set in environment variable', () => {
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

      middleware.getGpUrl(fakeRequest, {}, () => {});

      assert.equal(
        fakeRequest.urlForGp,
        'http://test/123456?apikey=secret');
    });
  });
});
