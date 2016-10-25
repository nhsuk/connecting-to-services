const renderer = require('../middleware/renderer');
const locationValidator = require('../lib/locationValidator');

function validateLocation(req, res, next) {
  const location = res.locals.location;

  const validationResult = locationValidator(location);

  // eslint-disable-next-line no-param-reassign
  res.locals.location = validationResult.input;

  if (validationResult.errorMessage) {
    // eslint-disable-next-line no-param-reassign
    res.locals.errorMessage = validationResult.errorMessage;
    renderer.findHelp(req, res);
  } else {
    next();
  }
}

module.exports = validateLocation;
