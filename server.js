const express = require('express');
const config = require('./config/config');
const configExpress = require('./config/express');
const loadData = require('./config/loadData');

const app = express();

module.exports = (() => {
  loadData();
  configExpress(app, config);
  app.port = config.port;
  return app;
})();
