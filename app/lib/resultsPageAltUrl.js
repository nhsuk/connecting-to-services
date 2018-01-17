const querystring = require('querystring');

const siteRoot = require('./constants').SITE_ROOT;

function resultsPageAltUrl(req) {
  const displayOpenResults = req.query.open ? req.query.open.toLowerCase() === 'true' : false;

  const query = req.query;
  query.open = !displayOpenResults;
  return `${siteRoot}${req.path}?${querystring.stringify(query)}`;
}

module.exports = resultsPageAltUrl;
