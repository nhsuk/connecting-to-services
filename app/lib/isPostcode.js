const Postcode = require('postcode');

function isPostcode(text) {
  const postcode = new Postcode(text);
  return (postcode.valid() || Postcode.validOutcode(text));
}

module.exports = isPostcode;
