const request = require('request');
const assert = require('chai').assert;
const server = require('../../server.js');

describe('Server', () => {
  describe('get GP details', () => {
    let actualResponse;
    before('start server', (done) => {
      server.listen();
      done();
    });
    after('stop server', (done) => {
      server.close();
      done();
    });
    describe('valid request', () => {
      beforeEach('make gpdetails request', (done) => {
        request('http://localhost:3000/gpdetails/12410', (error, response) => {
          if (error) throw error;
          actualResponse = response;
          done();
        });
      });
      return it('is successful', (done) => {
        assert.equal(actualResponse.statusCode, 200);
        done();
      });
    });
    describe('invalid request', () => {
      beforeEach('unknown gp', (done) => {
        request('http://localhost:3000/gpdetails/1', (error, response) => {
          if (error) throw error;
          actualResponse = response;
          done();
        });
      });
      return it('returns unknown status code', (done) => {
        assert.equal(actualResponse.statusCode, 404);
        done();
      });
    });
    describe('invalid request', () => {
      beforeEach('unknown page', (done) => {
        request('http://localhost:3000/', (error, response) => {
          if (error) throw error;
          actualResponse = response;
          done();
        });
      });
      return it('returns unknown status code', (done) => {
        assert.equal(actualResponse.statusCode, 404);
        done();
      });
    });
  });
});
