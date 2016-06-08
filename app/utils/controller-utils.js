const http = require('http');
const utils = {};

module.exports = utils;

utils.getSyndicationUrl = function getSyndicationUrl(req) {
  const gpId = req.params.gpId;
  const apikey = req.query.apikey;
  return `http://v1.syndication.nhschoices.nhs.uk/organisations/gppractices/${gpId}.json?apikey=${apikey}`;
};

utils.getGpDetails = function getGpDetails(url, callback) {
  http.get(url, (res) => {
    let body = '';

    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      callback(JSON.parse(body));
    });
  }).on('error', (e) => {
    console.log('Got an error: ', e);
  });
};
