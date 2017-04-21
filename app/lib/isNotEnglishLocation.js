const excludedRegEx = /^(JE|GY|IM|BT)\d+/i;

function isNotEnglishLocation(location) {
  return location !== undefined && location.trim().match(excludedRegEx) !== null;
}

module.exports = isNotEnglishLocation;
