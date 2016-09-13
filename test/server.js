// eslint has problems with chai expect statements
/* eslint-disable no-unused-expressions */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const expect = chai.expect;

chai.use(chaiHttp);

function checkHtmlResponse(err, res) {
  expect(err).to.be.null;
  expect(res).to.have.status(200);
  expect(res).to.be.html;
}

describe('The results-open route', () => {
  describe('happy paths', () => {
    it('should respond with the postcode, when it is valid', (done) => {
      const validPostcode = 'AB12 3CD';

      chai.request(app)
        .get('/results-open')
        .query({ location: validPostcode })
        .end((err, res) => {
          checkHtmlResponse(err, res);
          expect(res.text).to.equal(validPostcode);
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
        .get('/results-open')
        .query({ location: invalidPostcode })
        .end((err, res) => {
          checkHtmlResponse(err, res);
          expect(res.text).to.contain(errorMessage);
          done();
        });
    });

    it('should check a location is supplied and return an error message', (done) => {
      chai.request(app)
        .get('/results-open')
        .end((err, res) => {
          checkHtmlResponse(err, res);
          expect(res.text).to.contain('A valid postcode is required to progress');
          done();
        });
    });
  });
});
