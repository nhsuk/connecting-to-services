// eslint has problems with chai expect statements
/* eslint-disable no-unused-expressions */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const nock = require('nock');

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
  const baseUrl = 'http://v1.syndication.nhschoices.nhs.uk';
  const apikey = 'secret';

  before('setup environment variables', () => {
    originalUrl = process.env.NHSCHOICES_SYNDICATION_URL;
    originalApikey = process.env.NHSCHOICES_SYNDICATION_APIKEY;

    process.env.NHSCHOICES_SYNDICATION_URL = baseUrl;
    process.env.NHSCHOICES_SYNDICATION_APIKEY = apikey;
  });

  after('reset environemnt variables', () => {
    process.env.NHSCHOICES_SYNDICATION_URL = originalUrl;
    process.env.NHSCHOICES_SYNDICATION_APIKEY = originalApikey;
  });

  describe('happy paths', () => {
    const validPostcode = 'AB123CD';
    const requestPath =
      new RegExp(`/organisations/pharmacies/postcode/${validPostcode}\\?apikey=${apikey}`);

    it('should respond with the postcode, when it is valid', (done) => {
      nock(baseUrl)
        .get(requestPath)
        .reply(200, {});

      chai.request(app)
        .get(route)
        .query({ location: validPostcode })
        .end((err, res) => {
          checkHtmlResponse(err, res);
          expect(res.text).to.equal(validPostcode);
          done();
        });
    });

    it('should make a request to the syndication API with the supplied postcode', (done) => {
      const expectedAPICall =
        nock(baseUrl)
        .get(requestPath)
        .reply(200, {});

      chai.request(app)
        .get(route)
        .query({ location: validPostcode })
        .end((err, res) => {
          checkHtmlResponse(err, res);
          expect(expectedAPICall.isDone()).to.be.true;
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
