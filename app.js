const log = require('./app/lib/logger');
const app = require('./server');
const requireEnv = require('require-environment-variables');

requireEnv(['API_BASE_URL']);

app.listen(app.port, () => {
  log.info(`Express server listening on port ${app.port}`);
});
