const rp = require('request-promise-native');

// const headers = require('./headers');
// const search = require('../../../config/config').search;

async function request(url, headers = {}, query = {}, method = 'Get') {
  const response = await rp({
    body: JSON.stringify(query),
    headers,
    method,
    url,
  });
  return JSON.parse(response);
}

module.exports = request;
