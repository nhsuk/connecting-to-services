const Postcode = require('postcode');
const messages = require('../lib/messages');

function validateLocation(location) {
  let errorMessage = null;
  let locationToReturn = location;

  if (!location) {
    errorMessage = 'A valid postcode is required to progress';
  } else {
    locationToReturn = location.trim();
    const postcode = new Postcode(locationToReturn);

    if (!postcode.valid() && !Postcode.validOutcode(locationToReturn)) {
      errorMessage = messages.invalidPostcodeMessage(locationToReturn);
    }
  }

  return {
    errorMessage,
    input: locationToReturn,
  };
}

module.exports = validateLocation;
