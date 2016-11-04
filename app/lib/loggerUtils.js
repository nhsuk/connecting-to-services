Number.isNan = require('is-nan');
const assert = require('assert');
const bunyan = require('bunyan');
const splunkBunyan = require('splunk-bunyan-logger');
const requireEnv = require('require-environment-variables');

function defaultLogLevel() {
  return bunyan.DEBUG;
}

function getLogLevel(environment) {
  const logLevel = process.env.LOG_LEVEL;

  if (logLevel !== undefined && logLevel !== 'undefined') {
    const parsedLogLevel = parseInt(logLevel, 10);
    const logLevelName = bunyan.nameFromLevel[parsedLogLevel];
    if (logLevelName) {
      return parsedLogLevel;
    }
    if (Number.isNan(parsedLogLevel)) {
      assert(logLevelName, `${logLevel} is not a valid LOG_LEVEL`);
    } else {
      assert(logLevelName, `${parsedLogLevel} is not a valid LOG_LEVEL`);
    }
  }

  return {
    production: bunyan.INFO,
    test: bunyan.FATAL,
  }[environment] || defaultLogLevel();
}

function getStreams(environment) {
  const streams = [];

  if (environment === 'production') {
    requireEnv(['SPLUNK_HEC_TOKEN', 'SPLUNK_HEC_ENDPOINT']);
    streams.push(splunkBunyan.createStream({
      token: process.env.SPLUNK_HEC_TOKEN,
      url: process.env.SPLUNK_HEC_ENDPOINT,
    }));
  } else {
    streams.push({ stream: process.stdout });
  }
  return streams;
}

module.exports = {
  getLogLevel,
  getStreams,
  defaultLogLevel,
};
