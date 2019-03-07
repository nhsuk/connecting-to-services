const requireEnv = require('require-environment-variables');

const app = require('./server');
const applicationStarts = require('./app/lib/promCounters').applicationStarts;
const log = require('./app/lib/logger');

requireEnv(['API_BASE_URL']);

app.listen(app.port, () => {
  applicationStarts.inc(1);
  log.info(`Express server listening on port ${app.port}`);
});
