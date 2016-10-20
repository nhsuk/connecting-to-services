const postcodes = require('../lib/postcodes');

function coordinateResolver(req, res, next) {
  function afterLookup(err) {
    if (err === undefined) {
      next();
    } else {
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
    }
  }

  postcodes.lookup(res, afterLookup);
}

module.exports = coordinateResolver;
