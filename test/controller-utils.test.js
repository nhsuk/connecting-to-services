const assert = require('chai').assert;
const ControllerUtils = require('../app/utils/controller-utils.js');

describe('ControllerUtils', () => {
  describe('getSyndicationUrl(), when URL is set in environment variable', () => {
    before('Set Syndication URL', () => {
      process.env.NHSCHOICES_SYNDICATION_URL =
      'http://www.api.com/org/%s.json?apikey=secret';
    });
    after('Unset Syndication URL', () => {
      process.env.NHSCHOICES_SYNDICATION_URL = '';
    });
    it('should return a url with API key for a specific gp practice', () => {
      const fakeRequest = {
        params: { gpId: '123456' },
      };

      assert.equal(
        ControllerUtils.getSyndicationUrl(fakeRequest),
        'http://www.api.com/org/123456.json?apikey=secret');
    });
  });
});
