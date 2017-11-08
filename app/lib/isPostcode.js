const Postcode = require('postcode');

function isPostcode(text) {
  return ((new Postcode(text)).valid() || Postcode.validOutcode(text));
}

module.exports = isPostcode;
