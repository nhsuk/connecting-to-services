const express = require('express');
const locationValidator = require('./lib/locationValidator');
const render = require('./lib/renderer');

const app = express();

app.get('/results-open',
  locationValidator,
  render
);

module.exports = app;
