const Postcode = require('postcode');
const messages = require('./messages');
const stringUtils = require('./stringUtils');

function postcodeValidator(location) {
  let errorMessage = null;
  let locationToReturn = location;
  const locationWithoutSpaces = stringUtils.removeNonAlphanumericAndWhitespace(locationToReturn);

  const postcode = new Postcode(locationWithoutSpaces);

  if (postcode.valid()) {
    locationToReturn = postcode.normalise();
  } else if (Postcode.validOutcode(locationWithoutSpaces)) {
    locationToReturn = locationWithoutSpaces.toLocaleUpperCase();
  } else {
    errorMessage = messages.invalidPostcodeMessage(location);
  }

  return {
    errorMessage,
    alteredLocation: locationToReturn,
  };
}

module.exports = postcodeValidator;
