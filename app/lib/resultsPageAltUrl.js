const querystring = require('querystring');

const deepClone = require('./utils').deepClone;
const displayOpenResults = require('./displayOpenResults');
const siteRoot = require('./constants').SITE_ROOT;

function resultsPageAltUrl(req) {
  const query = deepClone(req.query);
  query.open = !displayOpenResults(req);
  return `${siteRoot}${req.path}?${querystring.stringify(query)}`;
}

module.exports = resultsPageAltUrl;
