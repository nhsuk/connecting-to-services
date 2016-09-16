const express = require('express');
const validateLocation = require('./middleware/locationValidator');
const render = require('./middleware/renderer');
const environment = require('./config/environment');
const performSearch = require('./middleware/performSearch');
const getDetails = require('./middleware/getDetails');
const filterOpenOrgs = require('./middleware/filterOpenOrgs');

environment.configure();

const app = express();

app.get('/results-open',
  validateLocation,
  performSearch,
  getDetails,
  filterOpenOrgs,
  render
);

module.exports = app;
