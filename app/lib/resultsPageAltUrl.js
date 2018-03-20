const querystring = require('querystring');

const deepClone = require('./utils').deepClone;
const displayOpenResults = require('./displayOpenResults');

function resultsPageAltUrl(req, datetimeOverride) {
  const query = deepClone(req.query);
  query.open = !displayOpenResults(req, datetimeOverride);
  return `${req.path}?${querystring.stringify(query)}`;
}

module.exports = resultsPageAltUrl;
