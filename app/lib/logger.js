const loggerUtils = require('./loggerUtils');
const bunyan = require('bunyan');

const env = process.env.NODE_ENV || 'development';

const log = bunyan.createLogger({
  name: 'finders',
  serializers: bunyan.stdSerializers,
  level: loggerUtils.getLogLevel(env),
  streams: loggerUtils.getStreams(env),
});

log.info({ logger: log }, `Created logger for ${env}.`);

module.exports = log;
