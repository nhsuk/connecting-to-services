function results(req, res) {
  const location = res.locals.location;
  const altResultsMessage = 'See only open places nearby';
  const altResultsUrl = `/symptoms/stomach-ache/results?location=${location}&open=true`;

  /* eslint-disable no-param-reassign */
  res.locals.altResults = {};
  res.locals.altResults.url = altResultsUrl;
  res.locals.altResults.message = altResultsMessage;
  /* eslint-enable no-param-reassign */

  res.render('results-file');
}

module.exports = {
  results,
};
