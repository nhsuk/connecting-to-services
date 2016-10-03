const locationValidator = require('../lib/locationValidator');

function validateLocation(req, res, next) {
  const location = req.query.location;

  const validationResult = locationValidator(location);

  // eslint-disable-next-line no-param-reassign
  res.locals.location = validationResult.input;

  if (validationResult.errorMessage) {
    res.render('search', { errorMessage: validationResult.errorMessage });
  } else {
    next();
  }
}

module.exports = validateLocation;
