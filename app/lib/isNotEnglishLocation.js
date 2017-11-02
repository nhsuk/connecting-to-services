const excludedRegEx = /^(JE|GY|IM|BT)\d+/i;

function isNotEnglishLocation(location) {
  return location.match(excludedRegEx) !== null;
}

module.exports = isNotEnglishLocation;
