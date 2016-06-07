var assert = require('chai').assert,
  util = require('util'),
  ControllerUtils = require('../app/utils/controller-utils.js');

describe('ControllerUtils', () => {
  describe('getSyndicationUrl()', () => {
    it('should return well formed url', () => {
      var gpId = 'gp-id',
        apiKey = 'api-key',
        fakeRequest = {'params':{'gpId':gpId},'query':{'apikey':apiKey}};

      assert.equal(
        ControllerUtils.getSyndicationUrl(fakeRequest),
        util.format('http://v1.syndication.nhschoices.nhs.uk/organisations/gppractices/%s.json?apikey=%s',
        gpId, apiKey));
    });
  });
});
