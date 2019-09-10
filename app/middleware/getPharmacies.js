const getNearbyServicesHistogram = require('../lib/promHistograms').getNearbyServices;
const getRequestUrl = require('../lib/getRequestUrl');
const log = require('../lib/logger');
const request = require('../lib/request');
const queryBuilder = require('../lib/queryBuilder');
const queryTypes = require('../lib/constants').queryTypes;
const headers = require('../lib/headers');
const mapper = require('../lib/mappers/azMapper');
const getDateTime = require('../lib/getDateTime');

function isEnglish(countries) {
  return countries && countries.filter(c => c === 'England').length > 0;
}

async function getPharmacies(req, res, next) {
  if (isEnglish(res.locals.countries)) {
    const options = {
      queryType: res.locals.displayOpenResults ? queryTypes.openNearby : queryTypes.nearby,
    };

    const query = queryBuilder(res.locals.coordinates, options);
    const url = getRequestUrl();

    log.info({ pharmacyLookupRequest: { url } }, 'get-pharmacies-request');
    const endTimer = getNearbyServicesHistogram.startTimer();
    try {
      const currentDateTime = getDateTime();
      const response = await request(url, headers, query, 'post');
      endTimer();
      res.locals.services = response
        .value
        .map(org => mapper(org, res.locals.coordinates, currentDateTime));
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
