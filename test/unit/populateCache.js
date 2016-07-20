const chai = require('chai');
const expect = chai.expect;
const AssertionError = require('assert').AssertionError;
const cache = require('memory-cache');
const populateCacheSync = require('../../app/lib/populateCache.js');

describe('populateCacheSync', () => {
  const knownGpId = 'A12345';
  const dataDir = 'test/unit/lib/resources/cache_data/';

  before('clear the cache', () => {
    cache.clear();
    expect(cache.size()).to.equal(0, 'Cache was not empty');
    expect(cache.get(knownGpId)).to.be.a('null');
  });
  it('should add book_online_url when it not empty', () => {
    populateCacheSync(`${dataDir}/test.csv`);

    const bookOnlineUrl = cache.get(knownGpId).book_online_url;

    expect(bookOnlineUrl).to.equal('http://web.site/from/the/file');
  });
  it('should add book_online_url when it is empty', () => {
    populateCacheSync(`${dataDir}/test.csv`);

    const emptyBookOnlineURL = cache.get('E12345').book_online_url;

    expect(emptyBookOnlineURL).to.equal('');
  });
  describe('should error when', () => {
    it('no records are contained in the file', () => {
      const path = 'no_records.csv';

      expect(() => { populateCacheSync(`${dataDir}${path}`); })

        .to.throw(AssertionError, `No records in file: '${dataDir}${path}'.`);
    });
    it('no data is contained in the file', () => {
      const path = 'empty.csv';

      expect(() => { populateCacheSync(`${dataDir}${path}`); })
        .to.throw(AssertionError, `No data in file: '${dataDir}${path}'.`);
    });
  });
});
