/* eslint-disable no-unused-expressions */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const nock = require('nock');
const getSampleResponse = require('./test-lib/getSampleResponse');

const expect = chai.expect;

chai.use(chaiHttp);

function checkHtmlResponse(err, res) {
  expect(err).to.be.null;
  expect(res).to.have.status(200);
  expect(res).to.be.html;
}

describe('The results-open route', () => {
  const route = '/results-open';

  let originalUrl = '';
  let originalApikey = '';
  const baseUrl = 'http://web.site';
  const apikey = 'secret';

  before('setup environment variables', () => {
    originalUrl = process.env.NHSCHOICES_SYNDICATION_BASEURL;
    originalApikey = process.env.NHSCHOICES_SYNDICATION_APIKEY;

    process.env.NHSCHOICES_SYNDICATION_BASEURL = baseUrl;
    process.env.NHSCHOICES_SYNDICATION_APIKEY = apikey;
  });

  after('reset environemnt variables', () => {
    process.env.NHSCHOICES_SYNDICATION_BASEURL = originalUrl;
    process.env.NHSCHOICES_SYNDICATION_APIKEY = originalApikey;
  });

  describe('happy paths', () => {
    const validPostcode = 'AB123CD';
    const postcodeSearchPath =
      new RegExp(`/organisations/pharmacies/postcode/${validPostcode}`);

    it('should return the top 3 open results when the postcode is valid', (done) => {
      const postcodeSearchResponse = getSampleResponse('paged_pharmacies_postcode_search');
      const overviewResponse = getSampleResponse('org_overview');

      const postcodeSearchScope =
        nock(baseUrl)
        .get(postcodeSearchPath)
        .query(true)
        .times(10)
        .reply(200, postcodeSearchResponse);

      const overviewScope =
      nock(/.*nhschoices.*/)
        .get(/organisations\/pharmacies\/\d+\/overview\.xml/)
        .query(true)
        .times(3)
        .reply(200, overviewResponse);

      chai.request(app)
        .get(route)
        .query({ location: validPostcode })
        .end((err, res) => {
          checkHtmlResponse(err, res);

          const jsonRes = JSON.parse(res.text);

          expect(jsonRes.length).to.equal(3);
          expect(postcodeSearchScope.isDone()).to.be.true;
          expect(overviewScope.isDone()).to.be.true;
          done();
        });
    });
  });

  describe('error handling', () => {
    it('should validate the postcode and return an error message', (done) => {
      const invalidPostcode = 'invalid';
      const errorMessage =
        `${invalidPostcode} is not a valid postcode, please try again`;

      chai.request(app)
        .get(route)
        .query({ location: invalidPostcode })
        .end((err, res) => {
          checkHtmlResponse(err, res);
          expect(res.text).to.contain(errorMessage);
          done();
        });
    });

    it('should check a location is supplied and return an error message', (done) => {
      chai.request(app)
        .get(route)
        .end((err, res) => {
          checkHtmlResponse(err, res);
          expect(res.text).to.contain('A valid postcode is required to progress');
          done();
        });
    });
  });
});
