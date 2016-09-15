function flattenArray(a, b) {
  return a.concat(b);
}

function processResults(err, results, req, next) {
  if (err) {
    next(err);
    return;
  }

  const flattenedResults = results.reduce(flattenArray
  , []);
  // eslint-disable-next-line no-param-reassign
  req.results = flattenedResults;
  next();
}

module.exports = processResults;
