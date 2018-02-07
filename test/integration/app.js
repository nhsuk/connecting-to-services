const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');

const expect = chai.expect;

chai.use(chaiHttp);

describe('redirection', () => {
  it('should redirect root requests to /find-a-pharmacy/', () => {
    chai.request(server)
      .get('/')
      .then((res) => {
        iExpect.htmlWith200Status(res);

        expect(res).to.redirect;
        expect(res.req.path).to.equal(`${constants.SITE_ROOT}/`);
      })
      .catch((err) => { throw err; });
  });
});

describe('An unknown page', () => {
  it('should return a 404', () => {
    chai.request(server)
      .get(`${constants.SITE_ROOT}/not-known`)
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res).to.be.html;

        const $ = cheerio.load(res.text);

        expect($('.local-header--title--question').text().trim())
          .to.equal('Page not found');
        expect($('title').text()).to.equal('Page not found - NHS.UK');
      })
      .catch((err) => { throw err; });
  });
});
