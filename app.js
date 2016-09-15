const express = require('express');
const validateLocation = require('./lib/locationValidator');
const render = require('./lib/renderer');
const http = require('http');
const environment = require('./config/environment');

environment.configure();

const app = express();

function getResults(req, res, next) {
  const postcode = req.query.location;
  const apikey = process.env.NHSCHOICES_SYNDICATION_APIKEY;
  const baseUrl = process.env.NHSCHOICES_SYNDICATION_BASEURL;

  http
    .get(`${baseUrl}/organisations/pharmacies/postcode/${postcode}?apikey=${apikey}`, () => {
      next();
    });
}

app.get('/results-open',
  validateLocation,
  getResults,
  render
);

module.exports = app;
