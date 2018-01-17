const backLinkUtils = require('../lib/backLinkUtils');
const completeOriginalUrl = require('../lib/completeOriginalUrl');
const resultsPageAltUrl = require('../lib/resultsPageAltUrl');

function fromRequest(req, res, next) {
  let displayOpenResults = false;
  displayOpenResults = req.query.open ? req.query.open.toLowerCase() === 'true' : false;

  res.locals.resultsPageAltUrl = resultsPageAltUrl(req);
  res.locals.displayOpenResults = displayOpenResults;
  res.locals.req_location = req.query.location;
  res.locals.location = req.query.location;
  res.locals.locationLabel = 'Enter a town, city or postcode in England';
  res.locals.coordinates = {
    latitude: req.query.latitude,
    longitude: req.query.longitude,
  };
  res.locals.completeOriginalUrl = completeOriginalUrl(req);
  const backLink = backLinkUtils(req);
  res.locals.backLink = {
    href: backLink.url,
    text: backLink.text,
  };
  next();
}

module.exports = {
  fromRequest,
};
