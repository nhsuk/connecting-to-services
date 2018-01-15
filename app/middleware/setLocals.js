const completeOriginalUrl = require('../lib/completeOriginalUrl');
const backLinkUtils = require('../lib/backLinkUtils');

function fromRequest(req, res, next) {
  let displayOpenResults = false;
  if (req.query.open) {
    displayOpenResults = req.query.open.toLowerCase() === 'true';
  }

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
