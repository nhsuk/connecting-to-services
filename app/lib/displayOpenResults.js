function displayOpenResults(req) {
  return req.query.open ? req.query.open.toLowerCase() === 'true' : false;
}

module.exports = displayOpenResults;
