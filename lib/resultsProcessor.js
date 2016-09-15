function flattenArray(a, b) {
  return a.concat(b);
}

function processResults(err, results, req, next) {
  if (err) {
    next(err);
    return;
  }

  const flattenedResults = results.reduce(flattenArray, []);
  const top3Results = flattenedResults.slice(0, 3);

  // eslint-disable-next-line no-param-reassign
  req.results = top3Results;
  next();
}

module.exports = processResults;
