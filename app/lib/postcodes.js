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
    const encodedLocation = encodeURIComponent(location);
    url = `${baseUrl}/postcodes/${encodedLocation}`;
  }

  https.get(url, (postcodeRes) => {
    log.info({ postcodeLookupRequest: { url } }, 'postcode-lookup-start');
    let body = '';

    postcodeRes.on('data', (chunk) => {
      body += chunk;
    });

    postcodeRes.on('end', () => {
      log.debug({ postcodeLookupResponse: { response: postcodeRes } }, 'postcode-lookup-end');
      let postcode;
      const unknownMsg = `Postcode lookup returned statusCode: ${postcodeRes.statusCode} for ${location}`;

      switch (postcodeRes.statusCode) {
        case 200:
          log.info(`Postcode lookup success for ${location}`);
          postcode = JSON.parse(body);
          res.locals.coordinates = {
            latitude: postcode.result.latitude,
            longitude: postcode.result.longitude,
          };
          next();
          break;
        case 404:
          log.info(`Postcode lookup 404 for ${location}`);
          next({ type: 'invalid-postcode', message: messages.invalidPostcodeMessage(location) });
          break;
        default:
          log.warn(unknownMsg);
          next({ type: 'postcode-lookup-unknown-response', message: unknownMsg });
      }
    });
  }).on('error', (e) => {
    log.error({ postcodeLookupResponse: { error: e } }, 'Postcode lookup error');
    next({ type: 'postcode-lookup-error', message: e.message });
  });
}

module.exports = {
  lookup,
};
