const express = require('express');
const config = require('./config/config');
const configExpress = require('./config/express');
const dotenv = require('dotenv');
const requireEnv = require('require-environment-variables');

const app = express();

module.exports = (() => {
  dotenv.config({ path: './env/.env' });
  requireEnv(['NHSCHOICES_SYNDICATION_APIKEY']);
  requireEnv(['NHSCHOICES_SYNDICATION_URL']);
  requireEnv(['GOOGLE_MAPS_APIKEY']);
  configExpress(app, config);
  app.port = config.port;
  return app;
})();
