function removeNonAlphanumericAndDoubleSpaces(string) {
  return string.replace(/[^a-z0-9]/gi, ' ').replace(/\s\s+/g, ' ').trim();
}

function removeNonAddressCharacters(string) {
  return string.replace(/[^a-z0-9,]/gi, ' ').replace(/\s\s+/g, ' ').trim();
}

function removeNonAlphanumericAndWhitespace(string) {
  return string.replace(/\W+/g, '');
}

module.exports = {
  removeNonAlphanumericAndDoubleSpaces,
  removeNonAddressCharacters,
  removeNonAlphanumericAndWhitespace,
};
