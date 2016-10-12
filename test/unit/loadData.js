/* eslint-disable no-unused-expressions */
const chai = require('chai');
const cache = require('memory-cache');
const loadData = require('../../config/loadData');

const expect = chai.expect;

describe('Load data', () => {
  describe('happy path', () => {
    beforeEach('clear the cache', () => {
      cache.clear();
    });
    it('should load the geo hash data into cache', () => {
      expect(cache.get('geo')).is.null;
      loadData();
      expect(cache.get('geo')).is.not.null;
    });
    it('should load the org data into the cache', () => {
      expect(cache.get('orgs')).is.null;
      loadData();
      expect(cache.get('orgs')).is.not.null;
    });
  });
});
