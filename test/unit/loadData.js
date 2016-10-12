/* eslint-disable no-unused-expressions */
const chai = require('chai');
const cache = require('memory-cache');
const loadDataDefault = require('../../config/loadData');

const expect = chai.expect;

describe('Load data', () => {
  describe('default path', () => {
    it('loads the file in the data dir by default', () => {
      loadDataDefault();

      expect(cache.get('orgs')).to.not.be.null;
    });
  });

  describe('with overidden path', () => {
    const originalListPath = process.env.PHARMACY_LIST_PATH;
    let loadDataOverridden = {};

    before('set file location', () => {
      delete require.cache[require.resolve('../../config/loadData')];
      process.env.PHARMACY_LIST_PATH = '../test/resources/org_api_responses/10-pharmacies';
      // eslint-disable-next-line global-require
      loadDataOverridden = require('../../config/loadData');
    });
    after('reset file location', () => {
      process.env.PHARMACY_LIST_PATH = originalListPath;
      cache.clear();
    });

    beforeEach('clear the cache', () => {
      cache.clear();
    });
    afterEach('reset the cache', () => {
      cache.clear();
    });

    it('should load the geo hash data into cache', () => {
      expect(cache.get('geo')).is.null;
      loadDataOverridden();
      expect(cache.get('geo')).is.not.null;
    });
    it('should load the org data into the cache', () => {
      expect(cache.get('orgs')).is.null;
      loadDataOverridden();
      expect(cache.get('orgs')).is.not.null;
    });
    it('should load the data from the file in the env var', () => {
      loadDataOverridden();
      expect(cache.get('orgs').length).is.equal(10);
    });
  });
});
