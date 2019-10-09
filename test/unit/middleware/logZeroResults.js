const chai = require('chai');
const proxyquire = require('proxyquire');

const loggerStub = {};
const logZeroResults = proxyquire('../../../app/middleware/logZeroResults', { '../lib/logger': loggerStub });

const { expect } = chai;

describe('logZeroResults', () => {
  const location = 'some place';
  const nextStub = () => {};
  const reqStub = {};
  let loggerStubDoneFlag;
  let logObj;
  let logMsg;

  loggerStub.warn = (obj, msg) => { logObj = obj; logMsg = msg; loggerStubDoneFlag = true; };

  beforeEach('set flag to false', () => {
    loggerStubDoneFlag = false;
  });

  it('should log a warning when there are no results', () => {
    const res = { locals: { location, services: [] } };

    logZeroResults(reqStub, res, nextStub);

    expect(loggerStubDoneFlag).to.be.equal(true);
    expect(logObj).to.have.property('location', location);
    expect(logMsg).to.equal(`No results were found for ${location}`);
  });

  describe('does not log when there are some results', () => {
    it('should not log when there are open results', () => {
      const res = { locals: { location, services: [{}] } };

      logZeroResults(reqStub, res, nextStub);

      expect(loggerStubDoneFlag).to.be.equal(false);
    });
  });
});
