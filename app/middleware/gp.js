const util = require('util');
const http = require('http');
const gpDetailsParser = require('../utilities/gpDetailsParser');

function getDetails(req, res, next) {
  http.get(req.urlForGp, (response) => {
    let syndicationXml = '';
    response.on('data', (chunk) => {
      syndicationXml += chunk;
    });

    response.on('end', () => {
      if (response.statusCode === 200) {
        /* Disabled since assigning to res is recommended best practice my Express */
        /* eslint-disable no-param-reassign */
        req.gpDetails = gpDetailsParser(syndicationXml);
        next();
      } else if (response.statusCode === 404) {
        const err = new Error('GP Not Found');
        err.status = 404;
        next(err);
      } else {
        next(`Error: ${response.statusCode}`);
      }
    });
  }).on('error', (e) => {
    console.log('Got an error: ', e);
    next(e);
  });
}

function render(req, res) {
  res.render('index', {
    title: 'GP Details',
    gpDetails: req.gpDetails,
  });
}

function getUrl(req, res, next) {
  const gpId = req.params.gpId;
  const syndicationApiKey = process.env.NHSCHOICES_SYNDICATION_APIKEY;
  const syndicationUrl = process.env.NHSCHOICES_SYNDICATION_URL;
  const requestUrl = `${syndicationUrl}${syndicationApiKey}`;
  req.urlForGp = util.format(requestUrl, gpId);
  next();
}

module.exports = {
  getDetails,
  render,
  getUrl,
};
