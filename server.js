const express = require('express');
const config = require('./config/config');
const app = express();
const configExpress = require('./config/express');
const dotenv = require('dotenv');
const requireEnv = require('require-environment-variables');

module.exports = (() => {
  dotenv.config();
  requireEnv(['NHSCHOICES_SYNDICATION_URL']);
  configExpress(app, config);
  app.port = config.port;
  return app;
})();
