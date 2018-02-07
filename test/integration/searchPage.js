const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const constants = require('../../app/lib/constants');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Search page', () => {
  describe('page title', () => {
    it('should be \'Find a pharmarcy - NHS.UK\'', () =>
      chai.request(server)
        .get(`${constants.SITE_ROOT}`)
        .then((res) => {
          const $ = cheerio.load(res.text);

          expect($('title').text()).to.equal('Find a pharmacy - NHS.UK');
        })
        .catch((err) => { throw err; }));
  });

  describe('return to Choices banner', () => {
    it('should have a link back to the Choices pharmacy finder', () =>
      chai.request(server)
        .get(`${constants.SITE_ROOT}`)
        .then((res) => {
          const $ = cheerio.load(res.text);

          expect($('.back-to-choices').attr('href'))
            .to.equal('https://www.nhs.uk/Service-Search/Pharmacy/LocationSearch/10?nobeta=true');
        })
        .catch((err) => { throw err; }));
  });
});
