const express = require('express');
const config = require('./config/config');
const configExpress = require('./config/express');

const app = express();

module.exports = (() => {
  configExpress(app, config);
  // eslint-disable-next-line prefer-destructuring
  app.port = config.port;
  return app;
})();
