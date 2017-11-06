function removeNonAlphabeticAndWhitespace(string) {
  return string.replace(/[^a-z]/gi, ' ').replace(/\s\s+/g, ' ').trim();
}

module.exports = {
  removeNonAlphabeticAndWhitespace
};
