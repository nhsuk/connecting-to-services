// consider any string with a number a postcode
const simplePostcodeMatch = /\d/;
function isPostcode(text) {
  return text && text.match(simplePostcodeMatch) !== null;
}

module.exports = isPostcode;
