const http = require('http');
const async = require('async');
const xmlParser = require('../lib/xmlParser');
const utils = require('../lib/resultsUtils');

function getData(requestUrl, page, cb) {
  const pagedRequestUrl = `${requestUrl}${page}`;

  http.get(pagedRequestUrl, (response) => {
    let xml = '';

    response.on('data', (chunk) => {
      xml += chunk;
    });

    response.on('end', () => {
      // TODO: Handle responses that are not 200
      const pharmacyList = xmlParser(xml);
      cb(null, pharmacyList);
    });
  });
}

function performSearch(req, res, next) {
  const requestUrl = utils.generateRequestUrl(req);

  const tenRequests = [];
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((item) => {
    tenRequests.push((cb) => {
      getData(requestUrl, item, cb);
    });
  });

  async.parallel(tenRequests,
    (err, results) => {
      if (err) {
        next(err);
        return;
      }

      const overviewUrls = utils.generateOverviewRequestUrls(results);
      // eslint-disable-next-line no-param-reassign
      req.overviewUrls = overviewUrls;

      next();
    });
}

module.exports = performSearch;
