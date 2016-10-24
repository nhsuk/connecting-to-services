const postcodes = require('../lib/postcodes');

function coordinateResolver(req, res, next) {
  const context = res.locals.context;

  function afterLookup(err) {
    let viewToRender = '';

    if (context === 'stomach-ache') {
      viewToRender = 'find-help-stomach-ache';
    } else {
      viewToRender = 'find-help';
    }

    if (err) {
      switch (err.type) {
        case 'invalid-postcode':
          res.render(viewToRender, { errorMessage: err.message });
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
