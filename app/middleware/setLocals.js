const backLinkUtils = require('../lib/backLinkUtils');

function fromRequest(req, res, next) {
  res.locals.location = req.query.location;
  res.locals.locationLabel = 'Enter a postcode';

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
