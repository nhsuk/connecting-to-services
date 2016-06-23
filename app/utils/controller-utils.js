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
      if (res.statusCode !== 200) {
        callback({ statusCode: res.statusCode });
      } else {
        const parsedBody = JSON.parse(body);
        parsedBody.statusCode = res.statusCode;
        callback(parsedBody);
      }
    });
  }).on('error', (e) => {
    console.log('Got an error: ', e);
    callback({ statusCode: '500' });
  });
};
