const backLinkUtils = require('../lib/backLinkUtils');
const completeOriginalUrl = require('../lib/completeOriginalUrl');
const resultsPageAltUrl = require('../lib/resultsPageAltUrl');
const displayOpenResults = require('../lib/displayOpenResults');

function fromRequest(req, res, next) {
  const backLink = backLinkUtils(req);
  res.locals.backLink = {
    href: backLink.url,
    text: backLink.text,
  };
  res.locals.completeOriginalUrl = completeOriginalUrl(req);
  res.locals.coordinates = {
    latitude: req.query.latitude,
    longitude: req.query.longitude,
  };
  res.locals.displayOpenResults = displayOpenResults(req);
  res.locals.location = req.query.location;
  res.locals.locationLabel = 'Enter a town, city or postcode in England';
  res.locals.req_location = req.query.location;
  res.locals.resultsPageAltUrl = resultsPageAltUrl(req);
  next();
}

module.exports = {
  fromRequest,
};
