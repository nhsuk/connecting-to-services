const bunyan = require('bunyan');
const splunkBunyan = require('splunk-bunyan-logger');
const requireEnv = require('require-environment-variables');

function getLogLevel(environment) {
  return {
    production: bunyan.INFO,
    test: bunyan.FATAL,
  }[environment] || bunyan.DEBUG;
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
};
