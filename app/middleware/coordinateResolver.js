const postcodes = require('../lib/postcodes');

function coordinateResolver(req, res, next) {
  function afterLookup(err) {
    if (err) {
      res.render('search', { errorMessage: err.message });
    } else {
      next();
    }
  }

  postcodes.lookup(res, afterLookup);
}

module.exports = coordinateResolver;
