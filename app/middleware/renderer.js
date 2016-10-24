function results(req, res) {
  const location = res.locals.location;
  const altResultsMessage = 'See only open places nearby';
  const altResultsUrl = `/symptoms/stomach-ache/results?location=${location}&open=true`;

  /* eslint-disable no-param-reassign */
  res.locals.altResults = {};
  res.locals.altResults.url = altResultsUrl;
  res.locals.altResults.message = altResultsMessage;
  /* eslint-enable no-param-reassign */

  res.render('results');
}

function findHelp(req, res) {
  const context = res.locals.context;
  let viewToRender = '';

  if (context === 'stomach-ache') {
    viewToRender = 'find-help-stomach-ache';
  } else {
    viewToRender = 'find-help';
  }

  res.render(viewToRender);
}

module.exports = {
  results,
  findHelp,
};
