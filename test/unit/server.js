// eslint has problems with chai expect statements
/* eslint-disable no-unused-expressions */

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../../server.js');
const fs = require('fs');
const sampleResponsesDir = `${__dirname}/resources/syndication_responses`;

chai.use(chaiHttp);

function getSampleResponse(responseName) {
  return fs.readFileSync(`${sampleResponsesDir}/${responseName}.xml`).toString();
}

describe('Server', () => {
  const baseUrl = 'http://v1.syndication.nhschoices.nhs.uk';
  const requestRoute = /\/organisations\/gppractices\/odscode\/[0-9]+.xml\?apikey=[a-z]*/;
  it('should get details for a known GP', (done) => {
    nock(baseUrl)
      .get(requestRoute)
      .reply(200, getSampleResponse('gp_practice_by_ods_code'));
    chai.request(app)
      .get('/gpdetails/12410')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        expect(res.text).to.contain('<h2>A Ditri</h2>');
        done();
      });
  });
  it('should return 404 for an unknown GP', (done) => {
    nock(baseUrl)
      .get(requestRoute)
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
    nock(baseUrl)
      .get(requestRoute)
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
