const locationValidator = require('../lib/locationValidator');

function validateLocation(req, res, next) {
  const location = req.query.location;
  const context = res.locals.context;
  let viewToRender = '';

  const validationResult = locationValidator(location);

  // eslint-disable-next-line no-param-reassign
  res.locals.location = validationResult.input;

  if (context === 'stomach-ache') {
    viewToRender = 'find-help-stomach-ache';
  } else {
    viewToRender = 'find-help';
  }

  if (validationResult.errorMessage) {
    res.render(viewToRender, { errorMessage: validationResult.errorMessage });
  } else {
    next();
  }
}

module.exports = validateLocation;
