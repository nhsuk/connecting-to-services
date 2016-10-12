const express = require('express');
const config = require('./config/config');
const configExpress = require('./config/express');
const requireEnv = require('require-environment-variables');
const loadData = require('./config/loadData');

const app = express();

module.exports = (() => {
  loadData();
  requireEnv(['NHSCHOICES_SYNDICATION_APIKEY']);
  requireEnv(['NHSCHOICES_SYNDICATION_BASEURL']);
  configExpress(app, config);
  app.port = config.port;
  return app;
})();
