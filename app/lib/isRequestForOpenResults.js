function isRequestForOpenResults(req) {
  return req.query.open ? req.query.open.toLowerCase() === 'true' : false;
}

module.exports = isRequestForOpenResults;
