require('newrelic');

const log = require('./app/lib/logger');
const app = require('./server');
const requireEnv = require('require-environment-variables');
const applicationStarts = require('./app/lib/promCounters').applicationStarts;

requireEnv(['API_BASE_URL']);

app.listen(app.port, () => {
  applicationStarts.inc(1);
  log.info(`Express server listening on port ${app.port}`);
});
