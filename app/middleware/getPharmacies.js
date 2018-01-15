const request = require('request');
const log = require('../lib/logger');
const constants = require('../lib/constants');
const getNearbyServicesHistogram = require('../lib/promHistorgrams').getNearbyServices;

function isEnglish(countries) {
  return countries && countries.filter(c => c === 'England').length > 0;
}

function getPharmacies(req, res, next) {
  if (isEnglish(res.locals.countries)) {
    const displayOpenResults = res.locals.displayOpenResults;
    const searchPoint = res.locals.coordinates;
    const numberOfResults =
      (displayOpenResults ? constants.api.openResultsCount : constants.api.nearbyResultsCount);

    const baseUrl = process.env.API_BASE_URL;
    const path = displayOpenResults ? constants.api.paths.open : constants.api.paths.nearby;
    const url = `${baseUrl}/${path}?latitude=${searchPoint.latitude}&longitude=${searchPoint.longitude}&limits:results=${numberOfResults}`;

    log.info({ pharmacyLookupRequest: { url } }, 'get-pharmacies-request');
    const endTimer = getNearbyServicesHistogram.startTimer();
    request(url, (error, response, body) => {
      endTimer();
      log.debug({ pharmacyLookupResponse: { error, response, body } }, 'get-pharmacies-response');

      if (error) {
        log.error({ pharmacyLookupResponse: { error, response, body } }, 'get-pharmacies-error');
        next('get-pharmacies-error');
      } else if (response.statusCode === 200) {
        log.info('get-pharmacies-success');
        res.locals.services = JSON.parse(body).results;
        next();
      } else {
        log.warn({ pharmacyLookupResponse: { error, response, body } }, 'get-pharmacies-warning');
        next(`${response.statusCode} response from services api`);
      }
    });
  } else {
    res.locals.services = [];
    next();
  }
}

module.exports = getPharmacies;
