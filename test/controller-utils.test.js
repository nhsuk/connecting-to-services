const assert = require('chai').assert;
const ControllerUtils = require('../app/utils/controller-utils.js');

describe('ControllerUtils', () => {
  describe('getSyndicationUrl()', () => {
    it('should return well formed url', () => {
      const gpId = 'gp-id';
      const apikey = 'api-key';
      const fakeRequest = {
        params: { gpId },
        query: { apikey },
      };

      assert.equal(
        ControllerUtils.getSyndicationUrl(fakeRequest),
        `http://v1.syndication.nhschoices.nhs.uk/organisations/gppractices/${gpId}.json?apikey=${apikey}`);
    });
  });
});
