const mapLink = require('../lib/mapLink');

function results(req, res, next) {
  const open = req.query.open || 'true';
  const location = res.locals.location;
  let altResultsUrl = '';

  if (open === 'true') {
    altResultsUrl = `${res.locals.SITE_ROOT}/results?location=${location}&open=false`;
  } else {
    altResultsUrl = `${res.locals.SITE_ROOT}/results?location=${location}&open=true`;
  }

  /* eslint-disable no-param-reassign */
  res.locals.nearbyServices = mapLink.addUrl(location, res.locals.nearbyServices);
  res.locals.altResultsUrl = altResultsUrl;
  res.locals.open = open;
  /* eslint-enable no-param-reassign */

  next();
}

module.exports = {
  results,
};
