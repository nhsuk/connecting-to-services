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
      if (postcodeRes.statusCode === 200) {
        const postcode = JSON.parse(body);

        // eslint-disable-next-line no-param-reassign
        res.locals.coordinates = {
          latitude: postcode.result.latitude,
          longitude: postcode.result.longitude,
        };
        next();
      } else {
        console.log('non 200 response code');
        next({ message: messages.invalidPostcodeMessage(location) });
      }
    });
  }).on('error', (e) => {
    // TODO: Add 'standard' error
    console.log(e);
    next({ message: messages.invalidPostcodeMessage(location) });
  });
}

module.exports = {
  lookup,
};
