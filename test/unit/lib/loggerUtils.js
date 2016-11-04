const chai = require('chai');
const utils = require('../../../app/lib/loggerUtils');
const bunyan = require('bunyan');
const AssertionError = require('assert').AssertionError;

const expect = chai.expect;

describe('loggerUtils', () => {
  describe('getLogLevel when not set by env vars', () => {
    it('should return INFO for production', () => {
      const logLevel = utils.getLogLevel('production');

      expect(logLevel).to.be.equal(bunyan.INFO);
    });
    it('should return DEBUG for development', () => {
      const logLevel = utils.getLogLevel('development');

      expect(logLevel).to.be.equal(bunyan.DEBUG);
    });
    it('should return DEBUG for an unknown environment', () => {
      const logLevel = utils.getLogLevel('unknown');

      expect(logLevel).to.be.equal(bunyan.DEBUG);
    });
    it('should return FATAL for test', () => {
      const logLevel = utils.getLogLevel('test');

      expect(logLevel).to.be.equal(bunyan.FATAL);
    });
  });

  describe('getLogLevel when env vars contain a valid level', () => {
    let previousLogLevel;
    const envVarLogLevel = bunyan.TRACE;

    beforeEach('set LOG_LEVEL env var', () => {
      previousLogLevel = process.env.LOG_LEVEL;
      process.env.LOG_LEVEL = envVarLogLevel;
    });
    afterEach('reset LOG_LEVEL env var', () => {
      process.env.LOG_LEVEL = previousLogLevel;
    });

    it('should return the same value as the env vars', () => {
      const logLevel = utils.getLogLevel('anything');

      expect(logLevel).to.be.equal(envVarLogLevel);
    });
  });

  describe('getLogLevel when env vars contain undefined', () => {
    let previousLogLevel;

    beforeEach('set LOG_LEVEL env var', () => {
      previousLogLevel = process.env.LOG_LEVEL;
      process.env.LOG_LEVEL = undefined;
    });
    afterEach('reset LOG_LEVEL env var', () => {
      process.env.LOG_LEVEL = previousLogLevel;
    });

    it('should return the default log value', () => {
      const logLevel = utils.getLogLevel('anything');

      expect(logLevel).to.be.equal(utils.defaultLogLevel());
    });
  });

  describe('getLogLevel when env vars contain an invalid numeric level', () => {
    let previousLogLevel;
    const invalidNumericLogLevel = 100;

    beforeEach('set LOG_LEVEL env var', () => {
      previousLogLevel = process.env.LOG_LEVEL;
      process.env.LOG_LEVEL = invalidNumericLogLevel;
    });
    afterEach('reset LOG_LEVEL env var', () => {
      process.env.LOG_LEVEL = previousLogLevel;
    });

    it('should throw an error', () => {
      expect(() => { utils.getLogLevel('anything'); })
        .to.throw(AssertionError,
        `${invalidNumericLogLevel} is not a valid LOG_LEVEL`);
    });
  });

  describe('getLogLevel when env vars contain an invalid word level', () => {
    let previousLogLevel;
    const wordLogLevel = 'invalid';

    beforeEach('set LOG_LEVEL env var', () => {
      previousLogLevel = process.env.LOG_LEVEL;
      process.env.LOG_LEVEL = wordLogLevel;
    });
    afterEach('reset LOG_LEVEL env var', () => {
      process.env.LOG_LEVEL = previousLogLevel;
    });

    it('should throw an error', () => {
      expect(() => { utils.getLogLevel('anything'); })
        .to.throw(AssertionError,
        `${wordLogLevel} is not a valid LOG_LEVEL`);
    });
  });

  describe('getStreams', () => {
    describe('for non-production environments', () => {
      it('should return a stream to stdout for none production environments', () => {
        const streams = utils.getStreams('not-production');

        expect(streams).to.be.instanceOf(Array);
        expect(streams.length).to.be.equal(1);
        expect(streams[0]).to.have.property('stream', process.stdout);
      });
    });
    describe('for production environments', () => {
      beforeEach('reset SPLUNK_HEC_* vars', () => {
        process.env.SPLUNK_HEC_TOKEN = '';
        process.env.SPLUNK_HEC_ENDPOINT = '';
      });
      afterEach('reset SPLUNK_HEC_* vars', () => {
        process.env.SPLUNK_HEC_TOKEN = '';
        process.env.SPLUNK_HEC_ENDPOINT = '';
      });

      it('should return a splunk stream for a production environment', () => {
        const token = 'test-token';
        const url = 'http://some.url';
        process.env.SPLUNK_HEC_TOKEN = token;
        process.env.SPLUNK_HEC_ENDPOINT = url;

        const streams = utils.getStreams('production');

        expect(streams).to.be.instanceOf(Array);
        expect(streams.length).to.be.equal(1);
        expect(streams[0]).to.have.property('stream');
        expect(streams[0]).to.not.have.property('stream', process.stdout);
        expect(streams[0].stream).to.have.property('logger');
      });

      it('should throw an exception when env vars are missing', () => {
        expect(() => { utils.getStreams('production'); })
        .to.throw(Error,
          'Environment variables missing');
      });
    });
  });
});
