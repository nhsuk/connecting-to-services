const utils = require('./utils');
const bunyan = require('bunyan');

const env = process.env.NODE_ENV || 'development';

const log = bunyan.createLogger({
  name: 'finders',
  serializers: bunyan.stdSerializers,
  level: utils.getLogLevel(env),
  streams: utils.getStreams(env),
});

log.info({ logger: log }, `Created logger for ${env}.`);

module.exports = log;
