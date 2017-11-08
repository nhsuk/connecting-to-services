const excludedRegEx = /^(JE|GY|IM|BT)\d+/i;

function isNotEnglishPostcode(location) {
  return location.match(excludedRegEx) !== null;
}

module.exports = isNotEnglishPostcode;
