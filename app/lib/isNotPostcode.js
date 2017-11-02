const Postcode = require('postcode');

function isNotPostcode(text) {
  const postcode = new Postcode(text);

  if (postcode.valid()) {
    return false;
  }
  if (Postcode.validOutcode(text)) {
    return false;
  }
  return true;
}

module.exports = isNotPostcode;
