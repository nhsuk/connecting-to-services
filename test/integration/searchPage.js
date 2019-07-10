const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Search page', () => {
  describe('happy path', () => {
    let $;

    before('make request', async () => {
      const res = await chai.request(server).get(`${constants.SITE_ROOT}`);

      $ = cheerio.load(res.text);
    });

    describe('page title', () => {
      it('should be \'Find a pharmarcy - NHS\'', async () => {
        expect($('head title').text()).to.equal('Find a pharmacy - NHS');
      });
    });

    describe('meta data', () => {
      it('should include the minimum level of meta data', () => {
        expect($('meta[property="og:image"]').attr('content')).to.equal(`${constants.SITE_ROOT}/images/opengraph-image.png`);
        expect($('meta[property="og:image:width"]').attr('content')).to.equal('1200');
        expect($('meta[property="og:image:height"]').attr('content')).to.equal('1200');
      });
    });

    describe('links on the page', () => {
      it('should have links to internet services & appliance contractors', async () => {
        const additionalLinksText = $('.additional-links p');
        const additionalLinks = $('.additional-links p a');

        expect($(additionalLinksText[0]).text()).to.equal('See all internet pharmacies');
        expect($(additionalLinks[0]).attr('href')).to.equal('https://www.nhs.uk/Service-Search/pharmacies/internetpharmacies');
        expect($(additionalLinksText[1]).text()).to.equal('See all dispensing appliance contractors');
        expect($(additionalLinks[1]).attr('href')).to.equal('https://www.nhs.uk/Service-Search/pharmacies/appliancepharmacies');
      });
    });
  });

  describe('bad searches', () => {
    const resultsRoute = `${constants.SITE_ROOT}/results`;
    it('should return search page for empty search', async () => {
      const res = await chai.request(server)
        .get(resultsRoute)
        .query({ location: '' });

      iExpect.htmlWith200Status(res);
      const $ = cheerio.load(res.text);
      iExpect.searchAgainPage($);
      expect($('head title').text()).to.equal('Find a pharmacy - Enter a town, city or postcode, or use your location - NHS');
    });

    it('should return search page for non-alphanumeric search', async () => {
      const res = await chai.request(server)
        .get(resultsRoute)
        .query({ location: '!@£$%' });

      iExpect.htmlWith200Status(res);
      const $ = cheerio.load(res.text);
      iExpect.searchAgainPage($);
      expect($('head title').text()).to.equal('Find a pharmacy - We can\'t find the postcode \'!@£$%\' - NHS');
    });
  });
});
