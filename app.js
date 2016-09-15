const express = require('express');
const validateLocation = require('./middleware/locationValidator');
const render = require('./middleware/renderer');
const environment = require('./config/environment');
const getResults = require('./middleware/getResults');

environment.configure();

const app = express();

app.get('/results-open',
  validateLocation,
  getResults,
  render
);

module.exports = app;
