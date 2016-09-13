// eslint has problems with chai expect statements
/* eslint-disable no-unused-expressions */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Application routes', () => {
  it('should mirror the postcode', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        expect(res.text).to.equal('Hello World!');
        done();
      });
  });
});
