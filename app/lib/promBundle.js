const expressPromBundle = require('express-prom-bundle');
const { promHistogramBuckets: buckets } = require('./constants');

const promBundle = expressPromBundle({ buckets, includePath: true });

module.exports = {
  middleware: promBundle,
  promClient: promBundle.promClient,
};
