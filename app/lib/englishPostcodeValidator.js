const Postcode = require('postcode');
const messages = require('./messages');
const stringUtils = require('./stringUtils');

function englishPostcodeValidator(location) {
  let errorMessage = null;
  let locationToReturn = location;
  const locationWithoutSpaces = stringUtils.removeNonAlphanumericAndWhitespace(locationToReturn);

  const postcode = new Postcode(locationWithoutSpaces);

  if (postcode.valid()) {
    locationToReturn = postcode.normalise();
  } else if (Postcode.validOutcode(locationWithoutSpaces)) {
    locationToReturn = locationWithoutSpaces.toLocaleUpperCase();
  } else {
    const sanitisedlocation = stringUtils.removeNonAlphanumericAndDoubleSpaces(locationToReturn);
    errorMessage = messages.invalidPostcodeMessage(sanitisedlocation);
  }

  return {
    errorMessage,
    alteredLocation: locationToReturn,
  };
}

module.exports = englishPostcodeValidator;
