const renderer = require('../middleware/renderer');
const postcodes = require('../lib/postcodes');

function coordinateResolver(req, res, next) {
  function afterLookup(err) {
    if (err) {
      switch (err.type) {
        case 'invalid-postcode':
          // eslint-disable-next-line no-param-reassign
          res.locals.errorMessage = err.message;
          renderer.findHelp(req, res);
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
