function removeNonAlphabeticAndWhitespace(string) {
  return string.replace(/[^a-z]/gi, ' ').replace(/\s\s+/g, ' ').trim();
}

function removeNonAddressCharacters(string) {
  return string.replace(/[^a-z0-9,]/gi, ' ').replace(/\s\s+/g, ' ').trim();
}

module.exports = {
  removeNonAlphabeticAndWhitespace,
  removeNonAddressCharacters
};
