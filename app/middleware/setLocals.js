const fullUrlUtils = require('../lib/fullUrlUtils');
const backLinkUtils = require('../lib/backLinkUtils');

function fromRequest(req, res, next) {
  res.locals.req_location = req.query.location;
  res.locals.location = req.query.location;
  res.locals.locationLabel = 'Enter a town, city or postcode in England';
  res.locals.coordinates = {
    latitude: req.query.latitude,
    longitude: req.query.longitude,
  };
  const fullUrl = fullUrlUtils(req);
  const backLink = backLinkUtils(req);
  res.locals.fullUrl = {
    href: fullUrl.url,
  };
  res.locals.backLink = {
    href: backLink.url,
    text: backLink.text,
  };
  next();
}

module.exports = {
  fromRequest,
};
