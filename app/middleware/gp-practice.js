const util = require('util');
const http = require('http');

const renderGpDetails = (response, gpDetails) => {
  response.render('index', {
    title: 'GP Details',
    gpDetails,
  });
};

const renderGpNotFound = (response) => {
  response.status(404).send('GP Not Found');
};

function getGpDetails(req, res, next) {
  http.get(req.urlForGp, (response) => {
    let body = '';
    response.on('data', (chunk) => {
      body += chunk;
    });

    response.on('end', () => {
      if (response.statusCode === 200) {
        renderGpDetails(res, JSON.parse(body));
      } else if (response.statusCode === 404) {
        renderGpNotFound(res);
      } else {
        next(`Error: ${response.statusCode}`);
      }
    });
  }).on('error', (e) => {
    console.log('Got an error: ', e);
    next(e);
  });
}

function getGpUrl(req, res, next) {
  const gpId = req.params.gpId;
  const syndicationApiKey = process.env.NHSCHOICES_SYNDICATION_APIKEY;
  const syndicationUrl = process.env.NHSCHOICES_SYNDICATION_URL;
  const requestUrl = `${syndicationUrl}${syndicationApiKey}`;
  // http://stackoverflow.com/questions/36756947/modify-res-without-mutating-argument
  // eslint-disable-next-line no-param-reassign
  req.urlForGp = util.format(requestUrl, gpId);
  next();
}

module.exports = {
  getGpDetails,
  getGpUrl,
};
