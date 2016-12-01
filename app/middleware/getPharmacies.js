const request = require('request');
const log = require('../lib/logger');

function getPharmacies(req, res, next) {
  const searchPoint = res.locals.coordinates;
  // TODO: Implement this
  // const limits = { nearby: 10, open: 3 };

  const latitude = searchPoint.latitude;
  const longitude = searchPoint.longitude;

  const baseUrl = process.env.API_BASE_URL;
  const url = `${baseUrl}/nearby?latitude=${latitude}&longitude=${longitude}`;

  log.info('get-pharmacies-start');
  request(url, (error, response, body) => {
    log.info('get-pharmacies-end');
    if (error) {
      log.error({ err: error, requestUrl: url }, 'Get services data failed');
      next('Get services data failed');
    }

    if (response.statusCode === 200) {
      const nearbyRes = JSON.parse(body);
      /* eslint-disable no-param-reassign*/
      res.locals.nearbyServices = nearbyRes.nearby;
      res.locals.openServices = nearbyRes.open;
      /* eslint-enable no-param-reassign*/
      next();
    } else {
      log.warn({ res: response }, `${response.statusCode} response from services api`);
      next(`${response.statusCode} response from services api`);
    }
  });
}

module.exports = getPharmacies;
