const http = require('http');
const async = require('async');
const xmlParser = require('../lib/xmlParser');
const utils = require('../lib/resultsUtils');

function getData(requestUrl, page, cb) {
  const pagedRequestUrl = `${requestUrl}${page}`;
  console.log(pagedRequestUrl);
  http.get(pagedRequestUrl, (res) => {
    let xml = '';
    res.on('data', (chunk) => {
      xml += chunk;
    });
    res.on('end', () => {
      // TODO: Handle responses that are not 200
      const pharmacyList = xmlParser(xml);
      cb(null, pharmacyList);
    });
  });
}

function processResults(err, results) {
  // results is an array of results from all requests
  results.forEach((request) => {
    console.log(request.length);
  });
  console.log(results.length);
  console.log('Finished CB');
}

function getResults(req, res, next) {
  const requestUrl = utils.generateRequestUrl(req);

  const tenRequests = [];
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((item) => {
    tenRequests.push((cb) => {
      getData(requestUrl, item, cb);
    });
  });

  async.parallel(tenRequests,
    (err, results) => {
      processResults(err, results);
      next();
    });
}

module.exports = getResults;
