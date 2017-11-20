const backLinkUtils = require('../lib/backLinkUtils');
const setLocationsOnLocals = require('../lib/setLocationsOnLocals');

function fromRequest(req, res, next) {
  res.locals.req_location = req.query.location;
  setLocationsOnLocals(res, req.query.location);
  res.locals.locationLabel = 'Enter a town, city or postcode';
  res.locals.coordinates = {
    latitude: req.query.latitude,
    longitude: req.query.longitude,
  };
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
