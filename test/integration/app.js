const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');

const expect = chai.expect;

chai.use(chaiHttp);

describe('redirection', () => {
  it('default should be find help page', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);

        // eslint-disable-next-line no-unused-expressions
        expect(res).to.redirect;
        expect(res.req.path).to.equal(`${constants.SITE_ROOT}/find-help`);
        done();
      });
  });

  it('/finder should redirect to find help page', (done) => {
    chai.request(server)
      .get(constants.SITE_ROOT)
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);

        // eslint-disable-next-line no-unused-expressions
        expect(res).to.redirect;
        expect(res.req.path).to.equal(`${constants.SITE_ROOT}/find-help`);
        done();
      });
  });
});

describe('An unknown page', () => {
  it('should return a 404', (done) => {
    chai.request(server)
      .get(`${constants.SITE_ROOT}/not-known`)
      .end((err, res) => {
        expect(err).to.not.be.equal(null);
        expect(res).to.have.status(404);
        // eslint-disable-next-line no-unused-expressions
        expect(res).to.be.html;

        const $ = cheerio.load(res.text);

        expect($('.local-header--title--question').text().trim())
          .to.equal('Page not found');
        done();
      });
  });
});

describe('The stomach ache page', () => {
  it('should be accessible directly', (done) => {
    chai.request(server)
      .get(`${constants.SITE_ROOT}/stomach-ache`)
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);

        const $ = cheerio.load(res.text);

        expect($('.local-header--title').text())
          .to.equal('Stomach ache');
        done();
      });
  });
});

describe('The find help page', () => {
  describe('with a context of stomach ache', () => {
    it('should contain content for finding help with stomach ache and a postcode input', (done) => {
      chai.request(server)
        .get(`${constants.SITE_ROOT}/find-help`)
        .query({ context: 'stomach-ache' })
        .end((err, res) => {
          iExpect.htmlWith200Status(err, res);

          const $ = cheerio.load(res.text);

          expect($('.page-section').text()).to.contain('For help with');
          iExpect.findHelpPage($);
          done();
        });
    });
  });

  describe('with no context', () => {
    it('should contain no additional content beyond the title and a postcode input', (done) => {
      chai.request(server)
        .get(`${constants.SITE_ROOT}/find-help`)
        .end((err, res) => {
          iExpect.htmlWith200Status(err, res);

          const $ = cheerio.load(res.text);

          expect($('.page-section').text()).to.not.contain('For help with');
          iExpect.findHelpPage($);
          done();
        });
    });
  });

  describe('with an unknown context', () => {
    it('should contain no additional content beyond the title and a postcode input', (done) => {
      chai.request(server)
        .get(`${constants.SITE_ROOT}/find-help`)
        .query({ context: 'unknown' })
        .end((err, res) => {
          iExpect.htmlWith200Status(err, res);

          const $ = cheerio.load(res.text);

          expect($('.page-section').text()).to.not.contain('For help with');
          iExpect.findHelpPage($);
          done();
        });
    });
  });
});
