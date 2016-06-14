const express = require('express');
const config = require('./config/config');
const app = express();
const dotenv = require('dotenv');
const requireEnv = require('require-environment-variables');

dotenv.config();

requireEnv(['NHSCHOICES_SYNDICATION_URL']);

require('./config/express')(app, config);

app.listen(config.port, () => {
  console.log(`Express server listening on port ${config.port}`);
});
