const bunyan = require('bunyan');

const env = process.env.NODE_ENV;
const log = bunyan.createLogger({
  name: 'finders',
  serializers: bunyan.stdSerializers,
  level: env === 'development' ? bunyan.DEBUG : bunyan.INFO,
});

log.info({ logger: log }, 'Created logger');

module.exports = log;
