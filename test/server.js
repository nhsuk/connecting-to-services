// eslint has problems with chai expect statements
/* eslint-disable no-unused-expressions */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const expect = chai.expect;

chai.use(chaiHttp);

describe('The application', () => {
  it('should mirror the postcode', (done) => {
    const validPostcode = 'AB12 3CD';
    chai.request(app)
      .get('/results-open')
      .query({ location: validPostcode })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        expect(res.text).to.equal(validPostcode);
        done();
      });
  });

  it('should validate the postcode and show error message', (done) => {
    const invalidPostcode = 'invalid';
    chai.request(app)
      .get('/results-open')
      .query({ location: invalidPostcode })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        expect(res.text).to.contain(`${invalidPostcode} is not a valid postcode, please try again`);
        done();
      });
  });
});
