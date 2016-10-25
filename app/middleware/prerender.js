const utils = require('../lib/utils');
const mapLink = require('../lib/mapLink');

function results(req, res, next) {
  const open = req.query.open || 'true';
  const context = res.locals.context;
  const location = res.locals.location;

  const reverseOpen = utils.flip(open);

  const headerMessage =
    (context === 'stomach-ache')
    ? `Pharmacies that can help you near to '${location}'`
    : `Pharmacies near to '${location}'`;

  /* eslint-disable no-param-reassign */
  res.locals.nearbyServices = mapLink.addUrl(location, res.locals.nearbyServices);
  res.locals.openServices = mapLink.addUrl(location, res.locals.openServices);
  res.locals.altResultsUrl =
      `${res.locals.SITE_ROOT}/results?location=${location}&open=${reverseOpen}&context=${context}`;
  res.locals.open = open;
  res.locals.headerMessage = headerMessage;
  res.locals.context = context;
  /* eslint-enable no-param-reassign */

  next();
}

module.exports = {
  results,
};
