const requireEnv = require('require-environment-variables');
const https = require('https');

const log = require('./app/lib/logger');
const app = require('./server');
const sslHelper = require('./app/lib/sslHelper');
const applicationStarts = require('./app/lib/promCounters').applicationStarts;

requireEnv(['API_BASE_URL']);

function appStarted() {
  applicationStarts.inc(1);
  log.info(`Express server listening on port ${app.port}`);
}

function createHttpsServer() {
  https.createServer(sslHelper.getHttpsOptions(), app).listen(app.port, () => {
    appStarted();
  });
}

function createHttpServer() {
  app.listen(app.port, () => {
    appStarted();
  });
}

function logError(error) {
  log.error({ createCertificate: { error } }, 'createCertificate-error');
}

if (process.env.NODE_ENV === 'development') {
  sslHelper.createCertificate().then(createHttpsServer).catch(logError);
} else {
  createHttpServer();
}
