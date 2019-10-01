function showCountry(countries, country) {
  return !countries || countries.length === 0 || !!countries.find((c) => c === country);
}

function hasNoCountries(countries) {
  return !countries || countries.length === 0;
}

module.exports = {
  hasNoCountries,
  showCountry,
};
