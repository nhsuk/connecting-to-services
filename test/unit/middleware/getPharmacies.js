const chai = require('chai');
const middleware = require('../../../app/middleware/services');
const nock = require('nock');
const getSampleResponse = require('../lib/getSampleResponse');

const expect = chai.expect;
chai.should();

describe('getPharmacies', () => {
  it('should get results across multiple pages', (done) => {
    const fakeRequest = {
      urlForPharmacy: 'http://test/test?apikey=secret',
    };
    nock('http://test')
      .get('/test')
      .query({ apikey: 'secret', page: '1' })
      .reply(200, getSampleResponse('pharmacies_by_postcode'));
    nock('http://test')
      .get('/test')
      .query({ apikey: 'secret', page: '2' })
      .reply(200, getSampleResponse('pharmacies_by_postcode_last'));

    middleware.getPharmacies(fakeRequest, {}, () => {
      expect(typeof (fakeRequest.pharmacyList)).to.not.equal('undefined');
      // expect(fakeRequest.pharmacyList[0].name).to.equal('blah');
      done();
    });
  });
});
