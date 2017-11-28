const renderer = require('./renderer');
const log = require('../lib/logger');

function renderFindHelpPage(req, res, message, errorMessage) {
  const location = res.locals.location;
  log.info({ locationValidationResponse: { location } }, message);
  res.locals.errorMessage = errorMessage;
  renderer.findHelp(req, res);
}

function renderNoResultsPage(req, res) {
  res.locals.nearbyServices = [];
  res.locals.openServices = [];
  renderer.results(req, res);
}

function renderNoLocationResultsPage(res) {
  renderer.notEnglishLocation(res);
}

module.exports = {
  renderFindHelpPage,
  renderNoResultsPage,
  renderNoLocationResultsPage,
};
