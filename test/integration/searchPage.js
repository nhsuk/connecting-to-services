const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const constants = require('../../app/lib/constants');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Search page', () => {
  describe('page title', () => {
    it('should be \'Find a pharmarcy - NHS.UK\'', async () => {
      const res = await chai.request(server).get(`${constants.SITE_ROOT}`);

      const $ = cheerio.load(res.text);

      expect($('head title').text()).to.equal('Find a pharmacy - NHS.UK');
    });
  });
  it('should have links to internet services & appliance contractors', async () => {
    const res = await chai.request(server).get(`${constants.SITE_ROOT}`);

    const $ = cheerio.load(res.text);

    const additionalLinksText = $('.additional-links p');
    const additionalLinks = $('.additional-links p a');

    expect($(additionalLinksText[0]).text()).to.equal('See all internet pharmacies');
    expect($(additionalLinks[0]).attr('href')).to.equal('https://www.nhs.uk/Service-Search/pharmacies/internetpharmacies');
    expect($(additionalLinksText[1]).text()).to.equal('See all dispensing appliance contractors');
    expect($(additionalLinks[1]).attr('href')).to.equal('https://www.nhs.uk/Service-Search/pharmacies/appliancepharmacies');
  });
});
