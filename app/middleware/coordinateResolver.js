const postcodes = require('../lib/postcodes');

function coordinateResolver(req, res, next) {
  function afterLookup(err) {
    if (err) {
      switch (err.type) {
        case 'invalid-postcode':
          res.render('find-help', { errorMessage: err.message });
          break;
        case 'postcode-service-error':
          next(`Postcode Service Error: ${err.message}`);
          break;
        default:
          next('Unknown Error');
      }
    } else {
      next();
    }
  }

  postcodes.lookup(res, afterLookup);
}

module.exports = coordinateResolver;
