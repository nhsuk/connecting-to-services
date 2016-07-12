const chai = require('chai');
const expect = chai.expect;
const Verror = require('verror');
const AssertionError = require('assert').AssertionError;
const gpDetailsParser = require('../../app/lib/gpDetailsParser');
const getSampleResponse = require('./lib/getSampleResponse');

describe('gpDetailsParser', () => {
  describe('happy path', () => {
    it('should get GP details from valid syndication response', () => {
      const syndicationXml = getSampleResponse('gp_practice_by_ods_code');
      const gpDetails = gpDetailsParser(syndicationXml);
      expect(gpDetails.name).to.equal('A Ditri');
      expect(gpDetails.address).to.eql(
        {
          line1: 'Chesser Surgery',
          line2: '121 Wrythe Lane',
          line3: 'Carshalton',
          line4: 'Surrey',
          postcode: 'SM5 2RT',
        });
      expect(gpDetails.overviewLink)
        .to.equal('http://v1.syndication.nhschoices.nhs.uk/organisations/gppractices/14500/overview.xml?apikey=secret');
    });
  });
  describe('error handling', () => {
    it('should throw exception when argument is missing.', () => {
      expect(() => { gpDetailsParser(); })
        .to.throw(
          AssertionError,
          'parameter \'xml\' undefined/empty');
      expect(() => { gpDetailsParser(''); })
        .to.throw(
          AssertionError,
          'parameter \'xml\' undefined/empty');
    });
    it('should throw exception when the argument is of the wrong type', () => {
      expect(() => { gpDetailsParser(1); })
        .to.throw(
          AssertionError,
          'parameter \'xml\' must be a string');
    });
    it('should throw exception when passed invalid XML', () => {
      const syndicationXml = '<invalidxmldocument>';
      expect(() => { gpDetailsParser(syndicationXml); })
        .to.throw(
          Verror,
          'Unable to parse GP XML: Unclosed root tag\nLine: 0\nColumn: 20\nChar:');
    });
    it('should throw exception when XML does not contain an organisation.', () => {
      const syndicationXml = '<xml></xml>';
      expect(() => { gpDetailsParser(syndicationXml); })
        .to.throw(
          AssertionError,
          'Organisation not found.');
    });
    it('should throw exception when organisation does not contain an address.', () => {
      const syndicationXml = '<Organisation>GP1</Organisation>';
      expect(() => { gpDetailsParser(syndicationXml); })
        .to.throw(
          AssertionError,
          'Organisation address not found.');
    });
    it('should throw exception when organisation does not contain an overview link.', () => {
      const syndicationXml =
        '<Organisation><Address>Address1</Address></Organisation>';
      expect(() => { gpDetailsParser(syndicationXml); })
        .to.throw(
          AssertionError,
          'Organisation overview link not found.');
    });
  });
});
