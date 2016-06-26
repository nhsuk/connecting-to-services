const chai = require('chai');
// eslint-disable-next-line no-unused-vars
const should = chai.should();
const chaiHttp = require('chai-http');
const nock = require('nock');
const express = require('express');
const config = require('../../config/config');
const app2 = express();
const dotenv = require('dotenv');
const requireEnv = require('require-environment-variables');

dotenv.config();

requireEnv(['NHSCHOICES_SYNDICATION_URL']);

require('../../config/express')(app2, config);

chai.use(chaiHttp);

describe('Server', () => {
  it('should get details for a known GP', (done) => {
    nock('http://v1.syndication.nhschoices.nhs.uk')
      .get(/\/organisations\/gppractices\/[0-9]+.json\?apikey=[a-z]*/)
      .reply(200, '{ "Name": "A GP Practice" }');
    chai.request(app2)
      .get('/gpdetails/12410')
      .end((err, res) => {
        res.statusCode.should.equal(200);
        res.text.should.contain('A GP Practice');
        done();
      });
  });
  it('should return 404 for an unknown GP', (done) => {
    nock('http://v1.syndication.nhschoices.nhs.uk')
      .get(/\/organisations\/gppractices\/[0-9]+.json\?apikey=[a-z]*/)
      .reply(404);
    chai.request(app2)
      .get('/gpdetails/12410')
      .end((err, res) => {
        res.statusCode.should.equal(404);
        done();
      });
  });
  it('should return 500 for syndication server error', (done) => {
    nock('http://v1.syndication.nhschoices.nhs.uk')
      .get(/\/organisations\/gppractices\/[0-9]+.json\?apikey=[a-z]*/)
      .reply(500);
    chai.request(app2)
      .get('/gpdetails/12410')
      .end((err, res) => {
        res.statusCode.should.equal(500);
        done();
      });
  });
  it('should return 404 for an unknown page', (done) => {
    chai.request(app2)
      .get('/unknown')
      .end((err, res) => {
        res.statusCode.should.equal(404);
        done();
      });
  });
});
