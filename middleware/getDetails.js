// Make request to API for all of the results using async
const http = require('http');
const async = require('async');
const overviewParser = require('../lib/overviewParser');

function getSingleOrgOverview(requestUrl, callback) {
  http.get(requestUrl, (res) => {
    let xml = '';

    res.on('data', (chunk) => {
      xml += chunk;
    });

    res.on('end', () => {
      // TODO: Handle responses that are not 200
      const orgDetails = overviewParser(xml);
      callback(null, orgDetails);
    });
  });
}

function getAllOrgsOverviews(req, res, next) {
  const overviewRequests =
  req.overviewUrls
  .slice(0, 2) // TODO: 100 requests breaks the API - need to find a way around it!
  .map(url =>
    (callback) => {
      getSingleOrgOverview(url, callback);
    });

  async.parallel(overviewRequests,
      (err, results) => {
        if (err) {
          next(err);
          return;
        }

        const flattenedResults = results.reduce((a, b) => a.concat(b), []);
        // eslint-disable-next-line no-param-reassign
        req.results = flattenedResults;
        next();
      });
}

module.exports = getAllOrgsOverviews;
