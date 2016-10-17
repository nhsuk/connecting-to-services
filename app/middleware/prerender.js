function results(req, res, next) {
  const open = req.query.open || 'true';
  const location = res.locals.location;
  const start = `saddr=${location}`;
  let altResultsUrl = '';

  if (open === 'true') {
    altResultsUrl = `${res.locals.SITE_ROOT}/results-file?location=${location}&open=false`;
  } else {
    altResultsUrl = `${res.locals.SITE_ROOT}/results-file?location=${location}&open=true`;
  }

  const mappedOrgs = res.locals.nearbyServices.map((item) => {
    // TODO: extract to lib
    const fullAddress = `${item.name},${item.address.line1}`.replace(/ /g, '+');
    const destination = `daddr=${fullAddress}`;
    const near = `near=${fullAddress}`;

    // eslint-disable-next-line no-param-reassign
    item.googleMapsQuery = `${start}&${destination}&${near}`;
    return item;
  });

  /* eslint-disable no-param-reassign */
  res.locals.nearbyServices = mappedOrgs;
  res.locals.altResultsUrl = altResultsUrl;
  res.locals.open = open;
  /* eslint-enable no-param-reassign */

  next();
}

module.exports = {
  results,
};
