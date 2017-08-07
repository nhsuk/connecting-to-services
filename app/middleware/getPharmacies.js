const request = require('request');
const log = require('../lib/logger');
const dedupe = require('../lib/dedupePharmacies');
const constants = require('../lib/constants');

function getPharmacies(req, res, next) {
  const searchPoint = res.locals.coordinates;
  const numberOfOpenResults = constants.numberOfOpenResults;
  const numberOfNearbyResults = constants.numberOfNearbyResultsToRequest;

  const baseUrl = process.env.API_BASE_URL;
  const url = `${baseUrl}/nearby?latitude=${searchPoint.latitude}&longitude=${searchPoint.longitude}&limits:results:open=${numberOfOpenResults}&limits:results:nearby=${numberOfNearbyResults}`;

  log.info({ pharmacyLookupRequest: { url } }, 'get-pharmacies-request');
  request(url, (error, response, body) => {
    log.debug({ pharmacyLookupResponse: { error, response, body } }, 'get-pharmacies-response');

    if (error) {
      log.error({ pharmacyLookupResponse: { error, response, body } }, 'get-pharmacies-error');
      next('get-pharmacies-error');
    } else if (response.statusCode === 200) {
      log.info('get-pharmacies-success');
      const nearbyRes = JSON.parse(body);
      const dedupedServices = dedupe(nearbyRes);
      /* eslint-disable no-param-reassign */
      res.locals.nearbyServices = dedupedServices.nearby;
      res.locals.openServices = dedupedServices.open;
      /* eslint-enable no-param-reassign */
      next();
    } else {
      log.warn({ pharmacyLookupResponse: { error, response, body } }, 'get-pharmacies-warning');
      next(`${response.statusCode} response from services api`);
    }
  });
}

module.exports = getPharmacies;
