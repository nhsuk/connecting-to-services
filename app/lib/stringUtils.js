function removeNonAlphanumericAndDoubleSpaces(string) {
  return string.replace(/[^a-z0-9]/gi, ' ').replace(/\s\s+/g, ' ').trim();
}

function removeNonAddressCharacters(string) {
  return string.replace(/[^a-z0-9,]/gi, ' ').replace(/\s\s+/g, ' ').trim();
}

function joinWithCommas(names) {
  let words = names;
  if (names.length > 2) {
    const lastWord = names.pop();
    words = [names.join(', '), lastWord];
  }
  return words.join(' and ');
}

module.exports = {
  removeNonAlphanumericAndDoubleSpaces,
  removeNonAddressCharacters,
  joinWithCommas,
};
