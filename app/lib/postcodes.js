const log = require('../../app/lib/logger');
const Postcode = require('postcode');
const https = require('https');
const messages = require('../lib/messages');

const baseUrl = 'https://api.postcodes.io';

const channelIsleRegEx = /^(JE|GY)/i;
const isleOfManRegEx = /^IM/i;

const isleOfManLatLong = {
  latitude: 54.206457,
  longitude: -4.570902
};
const channelIsleLatLong = {
  latitude: 49.2327,
  longitude: -2.1325
};

// postcodes in the Isle of Man and the Channel Isle are missing lat longs
// use the following values instead
const missingLatLongForCountry = {
  'Isle of Man': isleOfManLatLong,
  'Channel Islands': channelIsleLatLong,
};

function latLongValid(result) {
  return result.latitude && result.longitude;
}

function getLatLong(result) {
  return {
    latitude: result.latitude,
    longitude: result.longitude
  };
}

function getMissingLatLong(result) {
  if (result.country) {
    return missingLatLongForCountry[result.country];
  }
  if (result.outcode) {
    if (result.outcode.match(channelIsleRegEx)) {
      return channelIsleLatLong;
    }
    if (result.outcode.match(isleOfManRegEx)) {
      return isleOfManLatLong;
    }
  }
  return undefined;
}

function getCoordinates(result) {
  return latLongValid(result) ? getLatLong(result) : getMissingLatLong(result);
}

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
    log.info('postcodeio-lookup-start');
    let body = '';

    postcodeRes.on('data', (chunk) => {
      body += chunk;
    });

    postcodeRes.on('end', () => {
      log.info('postcodeio-lookup-end');
      let postcode;

      switch (postcodeRes.statusCode) {
        case 200:
          postcode = JSON.parse(body);
          // eslint-disable-next-line no-param-reassign
          res.locals.coordinates = getCoordinates(postcode.result);
          // eslint-disable-next-line no-unused-expressions
          if (res.locals.coordinates) {
            next();
          } else {
            const message = `No location found for ${location}`;
            log.error({ location, type: 'postcode-service-error' }, message);
            next({ type: 'postcode-service-error', message });
          }
          break;
        case 404:
          log.warn({ res: postcodeRes, location }, '404 from postcodes.io');
          next({ type: 'invalid-postcode', message: messages.invalidPostcodeMessage(location) });
          break;
        default:
          log.warn({ url, response: postcodeRes.statusCode, location }, `Postcode service error: ${postcodeRes.statusCode}`);
          next({
            type: 'postcode-service-error',
            message: `Postcode service error: ${postcodeRes.statusCode}`,
          });
      }
    });
  }).on('error', (e) => {
    log.error({ err: e, location, type: 'postcode-service-error' }, 'Postcode lookup failed');
    next({ type: 'postcode-service-error', message: e.message });
  });
}

module.exports = {
  lookup,
};
