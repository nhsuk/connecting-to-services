const Postcode = require('postcode');

function validateLocation(location) {
  let errorMessage = null;
  let locationToReturn = location;

  if (!location) {
    errorMessage = 'A valid postcode is required to progress';
  } else {
    locationToReturn = location.trim();
    const postcode = new Postcode(locationToReturn);

    if (!postcode.valid() && !Postcode.validOutcode(locationToReturn)) {
      errorMessage = `${locationToReturn} is not a valid postcode, please try again`;
    }
  }

  return {
    errorMessage,
    input: locationToReturn,
  };
}

module.exports = validateLocation;
