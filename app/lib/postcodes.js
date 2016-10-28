const log = require('../../app/lib/logger');
const Postcode = require('postcode');
const https = require('https');
const messages = require('../lib/messages');

const baseUrl = 'https://api.postcodes.io';

function lookup(res, next) {
  let url;
  const location = res.locals.location;
  const outcode = Postcode.validOutcode(location);

  if (outcode) {
    url = `${baseUrl}/outcodes/${location}`;
  } else {
    url = `${baseUrl}/postcodes/${location}`;
  }

  https.get(url, (postcodeRes) => {
    let body = '';

    postcodeRes.on('data', (chunk) => {
      body += chunk;
    });

    postcodeRes.on('end', () => {
      let postcode;
      switch (postcodeRes.statusCode) {
        case 200:
          postcode = JSON.parse(body);
          // eslint-disable-next-line no-param-reassign
          res.locals.coordinates = {
            latitude: postcode.result.latitude,
            longitude: postcode.result.longitude,
          };
          next();
          break;
        case 404:
          log.warn({ res: postcodeRes }, '404 from postcodes.io');
          next({ type: 'invalid-postcode', message: messages.invalidPostcodeMessage(location) });
          break;
        default:
          log.warn({ url, response: postcodeRes.statusCode });
          next(
            {
              type: 'postcode-service-error',
              message: `Postcode service error: ${postcodeRes.statusCode}`,
            }
          );
      }
    });
  }).on('error', (e) => {
    // TODO: Add 'standard' error
    log.error({ err: e }, 'Postcode lookup failed');
    next({ type: 'postcode-service-error', message: e.message });
  });
}

module.exports = {
  lookup,
};
