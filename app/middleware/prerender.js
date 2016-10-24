const mapLink = require('../lib/mapLink');

function results(req, res, next) {
  const open = req.query.open || 'true';
  const context = req.query.context || '';
  const location = res.locals.location;
  let openParam = '';
  let headerMessage = '';

  if (open === 'true') {
    openParam = 'false';
  } else {
    openParam = 'true';
  }

  if (context === 'stomach-ache') {
    headerMessage = `Pharmacies that can help you near to '${location}'`;
  } else {
    headerMessage = `Pharmacies near to '${location}'`;
  }
  /* eslint-disable no-param-reassign */
  res.locals.nearbyServices = mapLink.addUrl(location, res.locals.nearbyServices);
  res.locals.openServices = mapLink.addUrl(location, res.locals.openServices);
  res.locals.altResultsUrl =
      `${res.locals.SITE_ROOT}/results?location=${location}&open=${openParam}&context=${context}`;
  res.locals.open = open;
  res.locals.headerMessage = headerMessage;
  res.locals.context = context;
  /* eslint-enable no-param-reassign */

  next();
}

module.exports = {
  results,
};
