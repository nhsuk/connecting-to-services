const Postcode = require('postcode');

function isNotPostcode(text) {
  const locationToReturn = text && text.trim();

  const postcode = new Postcode(locationToReturn);

  if (postcode.valid()) {
    return false;
  }
  if (Postcode.validOutcode(locationToReturn)) {
    return false;
  }
  return true;
}

module.exports = isNotPostcode;
