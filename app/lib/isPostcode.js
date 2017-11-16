const simplePostcodeMatch = /\d/;
function isPostcode(text) {
  return text.match(simplePostcodeMatch) !== null;
}

module.exports = isPostcode;
