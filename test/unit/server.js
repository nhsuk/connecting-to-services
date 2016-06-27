// eslint has problems with chai expect statements
/* eslint-disable no-unused-expressions */

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../../server.js');

chai.use(chaiHttp);

describe('Server', () => {
  it('should get details for a known GP', (done) => {
    nock('http://v1.syndication.nhschoices.nhs.uk')
      .get(/\/organisations\/gppractices\/[0-9]+.json\?apikey=[a-z]*/)
      .reply(200, '{ "Name": "A GP Practice" }');
    chai.request(app)
      .get('/gpdetails/12410')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        expect(res.text).to.contain('<h2>A GP Practice</h2>');
        done();
      });
  });
  it('should return 404 for an unknown GP', (done) => {
    nock('http://v1.syndication.nhschoices.nhs.uk')
      .get(/\/organisations\/gppractices\/[0-9]+.json\?apikey=[a-z]*/)
      .reply(404);
    chai.request(app)
      .get('/gpdetails/12410')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res).to.be.html;
        done();
      });
  });
  it('should return 500 for syndication server error', (done) => {
    nock('http://v1.syndication.nhschoices.nhs.uk')
      .get(/\/organisations\/gppractices\/[0-9]+.json\?apikey=[a-z]*/)
      .reply(500);
    chai.request(app)
      .get('/gpdetails/12410')
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res).to.be.html;
        done();
      });
  });
  it('should return 404 for an unknown page', (done) => {
    chai.request(app)
      .get('/unknown')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res).to.be.html;
        done();
      });
  });
});
