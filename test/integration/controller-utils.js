const assert = require('chai').assert;
const util = require('util');
const ControllerUtils = require('../../app/utils/controller-utils.js');

describe('Controller Utils', () => {
  describe('valid gp id', () => {
    it('should return a json resource for the GP', () => {
      const syndicationUrl = process.env.NHSCHOICES_SYNDICATION_URL;
      const url = util.format(syndicationUrl, 12410);
      ControllerUtils.getGpDetails(url, (response) => {
        assert.equal(response.Name, 'The Grays Surgery');
      });
    });
  });
});
