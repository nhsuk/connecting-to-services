const http = require('http');
const util = require('util');
const utils = {};

module.exports = utils;

utils.getSyndicationUrl = function getSyndicationUrl(req) {
  const gpId = req.params.gpId;
  const syndicationUrl = process.env.NHSCHOICES_SYNDICATION_URL;
  return util.format(syndicationUrl, gpId);
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
