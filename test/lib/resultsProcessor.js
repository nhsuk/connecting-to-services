/* eslint-disable no-unused-expressions */
const chai = require('chai');
const processResults = require('../../lib/resultsProcessor');

const expect = chai.expect;

describe('resultsProcess', () => {
  describe('happy path', () => {
    it('should add the top 3 open results to the req', () => {
      const req = {};
      const results = [
        [{ one: 'one' }],
        [{ two: 'two' }],
        [{ three: 'three' }],
        [{ four: 'four' }],
      ];
      const flattenedResults = [
        { one: 'one' },
        { two: 'two' },
        { three: 'three' },
      ];

      processResults(null, results, req, () => {});

      expect(req.results).to.eql(flattenedResults);
    });
    it('should call next', () => {
      let test = false;
      const next = () => { test = true; };

      processResults(null, [], {}, next);

      expect(test).to.be.true;
    });
  });

  describe('error handling', () => {
    it('should pass the error to next when an error occurs', () => {
      let err = '';
      const errorMessage = 'error occurred';
      const next = (message) => { err = message; };

      processResults(errorMessage, null, null, next);

      expect(err).to.equal(errorMessage);
    });
  });
});
