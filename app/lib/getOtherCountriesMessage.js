const joinWithCommas = require('./stringUtils').joinWithCommas;

function getOtherCountriesMessage(countries) {
  const otherCountries = countries.filter(country => country !== 'England');
  if (otherCountries.length > 0) {
    return `This search returned results in ${joinWithCommas(otherCountries)}.`;
  }
  return '';
}

module.exports = getOtherCountriesMessage;
