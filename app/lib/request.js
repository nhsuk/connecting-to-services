const rp = require('request-promise-native');

module.exports = async (url, headers = {}, query = {}, method = 'Get') => JSON.parse(await rp({
  body: JSON.stringify(query),
  headers,
  method,
  url,
}));
