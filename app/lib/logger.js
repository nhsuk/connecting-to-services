const utils = require('./utils');
const bunyan = require('bunyan');

const log = bunyan.createLogger({
  name: 'finders',
  serializers: bunyan.stdSerializers,
  level: utils.getLogLevel(process.env.NODE_ENV),
});

log.info({ logger: log }, 'Created logger');

module.exports = log;
