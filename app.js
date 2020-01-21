const requireEnv = require('require-environment-variables');

const { dotenvPath } = require('./config/config');
require('dotenv').config({ path: dotenvPath });

const app = require('./server');
const applicationStarts = require('./app/lib/promCounters').applicationStarts;
const log = require('./app/lib/logger');

requireEnv(['SEARCH_API_KEY']);

app.listen(app.port, () => {
  applicationStarts.inc(1);
  log.info(`Express server listening on port ${app.port}`);
});
