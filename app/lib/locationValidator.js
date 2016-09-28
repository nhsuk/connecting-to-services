const Postcode = require('postcode');

function validateLocation(location) {
  let errorMessage = null;

  if (!location) {
    errorMessage = 'A valid postcode is required to progress';
  } else {
    const postcode = new Postcode(location);

    if (!postcode.valid() && !Postcode.validOutcode(location)) {
      errorMessage = `${location} is not a valid postcode, please try again`;
    }
  }

  return {
    errorMessage,
    input: location,
  };
}

module.exports = validateLocation;
