const chai = require('chai');
const expect = chai.expect;
const syndicationParser = require('../../app/lib/gpDetailsParser');
const getSampleResponse = require('./lib/getSampleResponse');

describe('Utilities', () => {
  describe('gpDetailsParser', () => {
    it('should get GP details from syndication response', () => {
      const syndicationXml = getSampleResponse('gp_practice_by_ods_code');
      const gpDetails = syndicationParser(syndicationXml);
      expect(gpDetails.name).to.equal('A Ditri');
      expect(gpDetails.address).to.eql(
        {
          line1: 'Chesser Surgery',
          line2: '121 Wrythe Lane',
          line3: 'Carshalton',
          line4: 'Surrey',
          postcode: 'SM5 2RT',
        });
      expect(gpDetails.overviewLink).to.equal('http://v1.syndication.nhschoices.nhs.uk/organisations/gppractices/14500/overview.xml?apikey=secret');
    });
  });
});
