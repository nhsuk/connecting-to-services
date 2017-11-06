const PostcodesIO = require('postcodesio-client');

// monkey patch postcodesIO to add places method
PostcodesIO.prototype.lookupPlaces = function lookupPlaces(place, limit, callback) {
  // eslint-disable-next-line no-underscore-dangle
  return this._request('get', 'places', { q: place, limit })
    .nodeify(callback);
};

const postcodes = new PostcodesIO();

function byPostcode(postcode) {
  return postcodes.lookup(postcode);
}

function byPlace(place, limit = 10) {
  return postcodes.lookupPlaces(place, limit);
}

module.exports = {
  byPostcode,
  byPlace
};
