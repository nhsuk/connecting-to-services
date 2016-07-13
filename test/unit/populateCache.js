const chai = require('chai');
const expect = chai.expect;
const assert = require('assert');
const cache = require('memory-cache');
const populateCacheSync = require('../../app/lib/populateCache.js');

describe('populateCacheSync', () => {
  before('clear the cache', () => {
    cache.clear();
    expect(cache.size()).to.equal(0, 'Cache was not empty');
  });
  it('should add object with supplier_name', () => {
    const knownGpId = 'A12345';
    expect(cache.get(knownGpId)).to.be.a('null');

    populateCacheSync('test/unit/lib/resources/cache_data/test.csv');

    const cacheEntry = cache.get(knownGpId);
    expect(cacheEntry).to.not.be.a('null');
    expect(cacheEntry).to.be.an('object');
    expect(cacheEntry).to.include.keys('supplier_name');
    expect(cacheEntry.supplier_name).to.equal('TPP');
  });
  it('should error when no data is contained in the file', () => {
    const path = 'test/unit/lib/resources/cache_data/empty.csv';
    expect(() => { populateCacheSync(path); })
      .to.throw(assert.AssertionError, `No data in file: '${path}'.`);
  });
});
