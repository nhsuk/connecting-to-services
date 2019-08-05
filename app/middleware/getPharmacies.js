const getNearbyServicesHistogram = require('../lib/promHistograms').getNearbyServices;
const getRequestUrl = require('../lib/getRequestUrl');
const log = require('../lib/logger');
const request = require('../lib/request');

function isEnglish(countries) {
  return countries && countries.filter(c => c === 'England').length > 0;
}

async function getPharmacies(req, res, next) {
  if (isEnglish(res.locals.countries)) {
    const url = getRequestUrl(res.locals.coordinates, res.locals.displayOpenResults);

    log.info({ pharmacyLookupRequest: { url } }, 'get-pharmacies-request');
    const endTimer = getNearbyServicesHistogram.startTimer();
    try {
      const response = await request(url);
      endTimer();
      res.locals.services = response.results;
      next();
    } catch (error) {
      log.error({ pharmacyLookupResponse: { error } }, 'get-pharmacies-error');
      next('get-pharmacies-error');
    }
  } else {
    res.locals.services = [];
    next();
  }
}

module.exports = getPharmacies;
