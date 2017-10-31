const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const server = require('../../server');
const constants = require('../../app/lib/constants');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Search page', () => {
  describe('page title', () => {
    it('should be \'Find a pharmarcy - NHS.UK\'', (done) => {
      chai.request(server)
        .get(`${constants.SITE_ROOT}/find-help`)
        .end((err, res) => {
          const $ = cheerio.load(res.text);

          expect($('title').text()).to.equal('Find a pharmacy - NHS.UK');
          done();
        });
    });
  });

  describe('return to Choices banner', () => {
    it('should have a link back to the Choices pharmacy finder', (done) => {
      chai.request(server)
        .get(`${constants.SITE_ROOT}/find-help`)
        .end((err, res) => {
          const $ = cheerio.load(res.text);

          expect($('.back-to-choices').attr('href'))
            .to.equal('https://www.nhs.uk/Service-Search/Pharmacy/LocationSearch/10?nobeta=true');
          done();
        });
    });
  });
});
