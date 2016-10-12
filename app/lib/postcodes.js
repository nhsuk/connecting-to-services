const Postcode = require('postcode');
const https = require('https');

const baseUrl = 'https://api.postcodes.io';

function lookup(res, next) {
  let url;
  const outcode = Postcode.validOutcode(res.locals.location);

  if (outcode) {
    url = `${baseUrl}/outcodes/${res.locals.location}`;
  } else {
    url = `${baseUrl}/postcodes/${res.locals.location}`;
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
        next({ message: 'unable to lookup postcode at this time' });
      }
    });
  }).on('error', (e) => {
    // TODO: Add 'standard' error
    console.log(e);
    next({ message: 'unable to lookup postcode at this time' });
  });
}

module.exports = {
  lookup,
};
