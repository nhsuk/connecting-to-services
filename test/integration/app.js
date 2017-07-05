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

describe('page response', () => {
  it('should consist of required security headers', (done) => {
    chai.request(server)
      .get(`${constants.SITE_ROOT}/finders/find-help`)
      .end((err, res) => {
        expect(res).to.have.header('Content-Security-Policy', 'default-src \'self\'; child-src https://*.hotjar.com:*; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' data: www.google-analytics.com s.webtrends.com statse.webtrendslive.com static.hotjar.com script.hotjar.com cdn.jsdelivr.net; img-src \'self\' data: static.hotjar.com www.google-analytics.com statse.webtrendslive.com hm.webtrends.com; style-src \'self\' \'unsafe-inline\' fast.fonts.net https://dhrlmnmyf2njb.cloudfront.net/; font-src fast.fonts.net https://dhrlmnmyf2njb.cloudfront.net/; connect-src \'self\' https://*.hotjar.com:* wss://*.hotjar.com');
        expect(res).to.have.header('X-Xss-Protection', '1; mode=block');
        expect(res).to.have.header('X-Frame-Options', 'DENY');
        expect(res).to.have.header('X-Content-Type-Options', 'nosniff');
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

describe('The find help page', () => {
  it('should contain a generic back link', (done) => {
    chai.request(server)
      .get(`${constants.SITE_ROOT}/find-help`)
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);

        const $ = cheerio.load(res.text);

        expect($('.link-back').text()).to.equal('Back');
        iExpect.findHelpPage($);
        done();
      });
  });
});
