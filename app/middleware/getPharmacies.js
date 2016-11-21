const request = require('request');
const log = require('../lib/logger');

function getPharmacies(req, res, next) {
  const searchPoint = res.locals.coordinates;
  // TODO: Implement this
  // const limits = { nearby: 10, open: 3 };

  const latitude = searchPoint.latitude;
  const longitude = searchPoint.longitude;

  // TODO: Extract to ENV var
  const baseUrl = process.env.API_BASE_URL;
  const url = `${baseUrl}/nearby?latitude=${latitude}&longitude=${longitude}`;

  log.info('get-pharmacies-start');
  request(url, (error, response, body) => {
    log.info('get-pharmacies-end');
    if (!error && response.statusCode === 200) {
      const nearbyRes = JSON.parse(body);
      /* eslint-disable no-param-reassign*/
      res.locals.nearbyServices = nearbyRes.nearby;
      res.locals.openServices = nearbyRes.open;
      /* eslint-enable no-param-reassign*/
      next();
    } else {
      // TODO: Test the errors being returned. Do one for status codes
      console.log(error);
      next('Error getting pharmacy data');
    }
  });
}

module.exports = getPharmacies;
