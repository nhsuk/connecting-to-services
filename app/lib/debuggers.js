const debug = require('debug');

const app = debug('finders:app');
const express = debug('finders:express');
const getPharmacies = debug('finders:getPharmacies');
const loadData = debug('finders:loadData');
const postcodes = debug('finders:postcodes');

module.exports = {
  app,
  express,
  getPharmacies,
  loadData,
  postcodes,
};
