const Postcode = require('postcode');
const messages = require('../lib/messages');

function validateLocation(location) {
  let errorMessage = null;
  let locationToReturn = location;

  if (!location) {
    errorMessage = messages.emptyPostcodeMessage();
  } else {
    locationToReturn = location.trim();
    const postcode = new Postcode(locationToReturn);

    if (postcode.valid()) {
      locationToReturn = postcode.normalise();
    } else if (Postcode.validOutcode(locationToReturn)) {
      locationToReturn = locationToReturn.toLocaleUpperCase();
    } else {
      errorMessage = messages.invalidPostcodeMessage(locationToReturn);
    }
  }

  return {
    errorMessage,
    alteredLocation: locationToReturn,
  };
}

module.exports = validateLocation;
