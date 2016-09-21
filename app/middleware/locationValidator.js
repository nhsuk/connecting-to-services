const Postcode = require('postcode');

function validateLocation(req, res, next) {
  const location = req.query.location;

  let message = '';

  if (!location) {
    message = 'A valid postcode is required to progress';
  } else {
    const postcode = new Postcode(location);

    if (postcode.valid() || Postcode.validOutcode(location)) {
      message = location;
    } else {
      message = `${location} is not a valid postcode, please try again`;
    }
  }

  if (message !== location) {
    res.send(message);
  } else {
    /* eslint-disable no-param-reassign */
    req.message = message;
    next();
  }
}

module.exports = validateLocation;
