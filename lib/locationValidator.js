const Postcode = require('postcode');

function validate(req, res, next) {
  const location = req.query.location;

  let message = '';

  if (!location) {
    message = 'A valid postcode is required to progress';
  } else {
    const postcode = new Postcode(location);

    if (postcode.valid()) {
      message = location;
    } else {
      message = `${location} is not a valid postcode, please try again`;
    }
  }

  // eslint-disable-next-line no-param-reassign
  req.message = message;
  next();
}

module.exports = validate;
