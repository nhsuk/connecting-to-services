// eslint - disabled no-param-reassign since assigning to request/response
// is recommended best practice by Express

const util = require('util');
const assert = require('assert');
const http = require('http');
const dateUtils = require('../lib/dateUtils.js');
const gpDetailsParser = require('../lib/gpDetailsParser');
const openingTimesParser = require('../lib/openingTimesParser');
const pharmaciesParser = require('../lib/pharmaciesParser');
const daysOfTheWeek = require('../lib/constants').daysOfTheWeek;
const cache = require('memory-cache');
const validUrl = require('valid-url');
const Verror = require('verror');

function getSyndicationResponseHandler(resourceType, parser, next) {
  return (response) => {
    let syndicationXml = '';
    response.on('data', (chunk) => {
      syndicationXml += chunk;
    });

    response.on('end', () => {
      if (response.statusCode === 200) {
        parser(syndicationXml);
        next();
      } else if (response.statusCode === 404) {
        const err = new Verror(`${resourceType} Not Found`);
        err.statusCode = 404;
        next(err);
      } else {
        const err = new Verror('Syndication HTTP Error');
        err.statusCode = response.statusCode;
        next(err);
      }
    });
  };
}

function getSyndicationResponse(url, resourceType, parser, next) {
  http
    .get(url, getSyndicationResponseHandler(resourceType, parser, next))
    .on('error', (e) => {
      const err = new Verror(e, 'Syndication Server Error');
      err.statusCode = 500;
      next(err);
    });
}

function getPharmacies(req, res, next) {
  // assert(validUrl.isUri(req.urlForGp), `Invalid URL: '${req.urlForGp}'`);
  getSyndicationResponse(
    req.urlForPharmacy,
    'Pharmacy List',
    (syndicationXml) => {
      // eslint-disable-next-line no-param-reassign
      req.pharmacyList = pharmaciesParser(syndicationXml);
    },
    next
  );
}

function getPharmacyOpeningTimes(req, res, next) {
  // assert(validUrl.isUri(req.urlForGp), `Invalid URL: '${req.urlForGp}'`);
  //
  let pharmacyCount = req.pharmacyList.length;

  req.pharmacyList.forEach((pharmacy) => {
    const pharmacyId = pharmacy.id.split('/').slice(-1)[0];

    getSyndicationResponse(
      `http://v1.syndication.nhschoices.nhs.uk/organisations/pharmacies/${pharmacyId}/overview.xml?apikey=${process.env.NHSCHOICES_SYNDICATION_APIKEY}`,
      'Pharmacy List',
      (syndicationXml) => {
        const now = new Date();
        const dayOfWeek = dateUtils.getDayName(now);
        try {
          /* eslint-disable no-param-reassign */
          pharmacy.openingTimes = openingTimesParser('general', syndicationXml);
          pharmacy.openingTimes.today = pharmacy.openingTimes[dayOfWeek].times;
          pharmacy.openNow = dateUtils.isOpen(now, pharmacy.openingTimes.today);
          /* eslint-enable no-param-reassign */
        } catch (e) {
          // intentionally left empty to allow pharmacies without any opening time
          // to be displayed without crashing the app
          console.log(e);
        }
      },
      () => {
        pharmacyCount--;
        if (pharmacyCount === 0) {
          next();
        }
      }
    );
  });
}

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
  assert.ok(validUrl.isUri(req.gpDetails.overviewLink),
    `Invalid URL: '${req.gpDetails.overviewLink}'`);

  getSyndicationResponse(
    req.gpDetails.overviewLink,
    'GP Practice Opening Times',
    (syndicationXml) => {
      // eslint-disable-next-line no-param-reassign
      req.gpDetails.openingTimes = {
        reception: openingTimesParser('reception', syndicationXml),
        surgery: openingTimesParser('surgery', syndicationXml),
      };
    },
    next
  );
}

function renderPharmacyList(req, res) {
  res.render('results', {
    daysOfTheWeek,
    pharmacyList: req.pharmacyList,
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

function getPharmacyUrl(req, res, next) {
  const location = req.query.location;
  const syndicationApiKey = process.env.NHSCHOICES_SYNDICATION_APIKEY;
  const requestUrl = `http://v1.syndication.nhschoices.nhs.uk/organisations/pharmacies/postcode/${location}.xml?range=35&apikey=${syndicationApiKey}`;

  // eslint-disable-next-line no-param-reassign
  req.urlForPharmacy = requestUrl;
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
  getPharmacyUrl,
  getDetails,
  getPharmacies,
  getPharmacyOpeningTimes,
  getOpeningTimes,
  getBookOnlineUrl,
  render,
  renderPharmacyList,
};
