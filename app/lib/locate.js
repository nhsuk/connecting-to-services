const PostcodesIO = require('postcodesio-client');

// monkey patch postcodesIO to add places method
PostcodesIO.prototype.lookupPlaces = function lookupPlaces(place, limit, callback) {
  // eslint-disable-next-line no-underscore-dangle
  return this._request('get', 'places', { q: place, limit })
    .nodeify(callback);
};

const postcodes = new PostcodesIO();

function asArray(value) {
  if (value) {
    return value.constructor === Array ? value : [value];
  }
  return [];
}

function addCountries(result) {
  // postcode lookups return country as single value but outcodes lookups
  // return country as an array. Add countries to always hold them as an array
  if (result) {
    // eslint-disable-next-line no-param-reassign
    result.countries = result && asArray(result.country);
  }
  return result;
}

async function byPostcode(postcode) {
  const result = await postcodes.lookup(postcode);
  return addCountries(result);
}

function byPlace(place, limit = 10) {
  return postcodes.lookupPlaces(place, limit);
}

async function byLatLon(lat, lon) {
  const result = await postcodes.reverseGeocode(lat, lon);
  return addCountries(result);
}

module.exports = {
  byPostcode,
  byPlace,
  byLatLon,
};
