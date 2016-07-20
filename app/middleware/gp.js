// eslint - disabled no-param-reassign since assigning to request/response
// is recommended best practice by Express

const util = require('util');
const assert = require('assert');
const http = require('http');
const gpDetailsParser = require('../lib/gpDetailsParser');
const gpOpeningTimesParser = require('../lib/gpOpeningTimesParser');
const daysOfTheWeek = require('../lib/constants').daysOfTheWeek;
const cache = require('memory-cache');
const validUrl = require('valid-url');
const Verror = require('verror');

function getDetails(req, res, next) {
  assert(validUrl.isUri(req.urlForGp), `Invalid URL: '${req.urlForGp}'`);

  http.get(req.urlForGp, (response) => {
    let syndicationXml = '';
    response.on('data', (chunk) => {
      syndicationXml += chunk;
    });

    response.on('end', () => {
      if (response.statusCode === 200) {
        // eslint-disable-next-line no-param-reassign
        req.gpDetails = gpDetailsParser(syndicationXml);
        next();
      } else if (response.statusCode === 404) {
        const err = new Verror('GP Not Found');
        err.statusCode = 404;
        next(err);
      } else {
        const err = new Verror('Syndication HTTP Error');
        err.statusCode = response.statusCode;
        next(err);
      }
    });
  }).on('error', (e) => {
    const err = new Verror(e, 'Syndication Server Error');
    err.statusCode = 500;
    next(err);
  });
}

function getOpeningTimes(req, res, next) {
  http.get(req.gpDetails.overviewLink, (response) => {
    let syndicationXml = '';
    response.on('data', (chunk) => {
      syndicationXml += chunk;
    });

    response.on('end', () => {
      if (response.statusCode === 200) {
        // eslint-disable-next-line no-param-reassign
        req.gpDetails.openingTimes = {
          reception: gpOpeningTimesParser('reception', syndicationXml),
          surgery: gpOpeningTimesParser('surgery', syndicationXml),
        };
        next();
      } else if (response.statusCode === 404) {
        const err = new Verror('GP Opening Times Not Found');
        err.statusCode = 404;
        next(err);
      } else {
        const err = new Verror('Syndication HTTP Error');
        err.statusCode = response.statusCode;
        next(err);
      }
    });
  }).on('error', (e) => {
    const err = new Verror(e, 'Syndication Server Error');
    err.statusCode = 500;
    next(err);
  });
}
function render(req, res) {
  res.render('index', {
    title: 'GP Practice Details',
    daysOfTheWeek,
    gpDetails: req.gpDetails,
  });
}

function getUrl(req, res, next) {
  const gpId = req.params.gpId;
  const syndicationApiKey = process.env.NHSCHOICES_SYNDICATION_APIKEY;
  const syndicationUrl = process.env.NHSCHOICES_SYNDICATION_URL;
  const requestUrl = `${syndicationUrl}${syndicationApiKey}`;
  // eslint-disable-next-line no-param-reassign
  req.urlForGp = util.format(requestUrl, gpId);
  next();
}

function upperCaseGpId(req, res, next) {
  // eslint-disable-next-line no-param-reassign
  req.params.gpId = req.params.gpId.toUpperCase();
  next();
}

function getBookOnlineUrl(req, res, next) {
  const gpId = req.params.gpId;

  // eslint-disable-next-line no-param-reassign
  req.gpDetails.bookOnlineUrl = cache.get(gpId).book_online_url;
  next();
}

module.exports = {
  upperCaseGpId,
  getUrl,
  getDetails,
  getOpeningTimes,
  getBookOnlineUrl,
  render,
};
