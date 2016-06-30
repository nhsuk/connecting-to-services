const chai = require('chai');
const expect = chai.expect;
const syndicationParser = require('../../app/utilities/gpDetailsParser');
const getSampleResponse = require('./getSampleResponse');

describe('Utilities', () => {
  describe('gpDetailsParser', () => {
    it('should get GP details from syndication response', () => {
      const syndicationXml = getSampleResponse('gp_practice_by_ods_code');
      const gpDetails = syndicationParser(syndicationXml);
      expect(gpDetails.Name).to.equal('A Ditri');
      expect(gpDetails.Address).to.eql(
        {
          Line1: 'Chesser Surgery',
          Line2: '121 Wrythe Lane',
          Line3: 'Carshalton',
          Line4: 'Surrey',
          Postcode: 'SM5 2RT',
        });
      expect(gpDetails.OverviewLink).to.equal('http://v1.syndication.nhschoices.nhs.uk/organisations/gppractices/14500/overview?apikey=secret');
    });
  });
});
