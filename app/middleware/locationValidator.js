const log = require('../lib/logger');
const renderer = require('../middleware/renderer');
const locationValidator = require('../lib/locationValidator');

function validateLocation(req, res, next) {
  const location = res.locals.location;

  log.info('validate-location-start');
  const validationResult = locationValidator(location);
  log.info('validate-location-end');

  // eslint-disable-next-line no-param-reassign
  res.locals.location = validationResult.input;

  if (validationResult.errorMessage) {
    log.info({ location }, 'Location failed validation');
    // eslint-disable-next-line no-param-reassign
    res.locals.errorMessage = validationResult.errorMessage;
    renderer.findHelp(req, res);
  } else {
    next();
  }
}

module.exports = validateLocation;
