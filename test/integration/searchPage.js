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

      expect($('title').text()).to.equal('Find a pharmacy - NHS.UK');
    });
  });
});
