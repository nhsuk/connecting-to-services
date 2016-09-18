const chai = require('chai');
const getSampleResponse = require('../test-lib/getSampleResponse');
const xmlParser = require('../../lib/xmlParser');
const Verror = require('verror');

const expect = chai.expect;

describe('xmlParser', () => {
  it('should get all results', () => {
    const results =
      xmlParser(getSampleResponse('paged_pharmacies_postcode_search'));

    expect(results.length).to.equal(10);
  });

  it('should throw an error when something goes wrong', () => {
    expect(() => { xmlParser('xml'); })
      .to.throw(
          Verror,
          'Unable to parse XML');
  });
});
