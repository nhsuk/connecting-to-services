const postcodes = require('../lib/postcodes');

function coordinateResolver(req, res, next) {
  function afterLookup(err) {
    if (err) {
      res.render('find-help', { errorMessage: err.message });
    } else {
      next();
    }
  }

  postcodes.lookup(res, afterLookup);
}

module.exports = coordinateResolver;
