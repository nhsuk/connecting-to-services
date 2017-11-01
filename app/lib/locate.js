const PostcodesIO = require('postcodesio-client');

// monkey patch postcodesIO to add places method
PostcodesIO.prototype.lookupPlaces = function lookupOutcode(place, callback) {
  // eslint-disable-next-line no-underscore-dangle
  return this._request('get', 'places', { q: place })
    .nodeify(callback);
};

const postcodes = new PostcodesIO();

function removeMultipleSpaces(string) {
  return string.replace(/[^a-z]/gmi, ' ').replace(/\s\s+/g, ' ');
}

function byPostcode(postcode) {
  return postcodes.lookup(postcode);
}

function byPlace(place) {
  return postcodes.lookupPlaces(removeMultipleSpaces(place));
}

module.exports = {
  byPostcode,
  byPlace
};
