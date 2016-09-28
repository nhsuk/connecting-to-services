const locationValidator = require('../lib/locationValidator');

function validateLocation(req, res, next) {
  const location = req.query.location;

  const errorMessage = locationValidator(location).errorMessage;

  if (errorMessage) {
    res.render('search', { errorMessage });
  } else {
    next();
  }
}

module.exports = validateLocation;
