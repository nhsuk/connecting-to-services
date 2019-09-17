const { search } = require('../../config/config');

function getRequestUrl() {
  return `https://${search.host}/service-search/search?api-version=${search.version}`;
}

module.exports = getRequestUrl;
