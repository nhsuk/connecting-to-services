var utils = {},
  util = require('util'),
  http = require('http');

module.exports = utils;

utils.getSyndicationUrl = function getSyndicationUrl(req) {
  var url = util.format(
    'http://v1.syndication.nhschoices.nhs.uk/organisations/gppractices/%s.json?apikey=%s',
    req.params.gpId,
    req.query.apikey);
  return url;
};

utils.getGpDetails = function getGpDetails(url, callback) {
  http.get(url, function(res) {

    var body = '';

    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      callback(JSON.parse(body));
    });
  }).on('error', function(e) {
    console.log('Got an error: ', e);
  });
};
