
const renderer = require('./renderer');
const log = require('../lib/logger');
const messages = require('../lib/messages');

function setLocationLabel(res, location) {
  if (location) {
    res.locals.locationLabel = messages.emptyPostcodeMessage();
  }
}

function renderFindHelpPage(req, res, location, message, errorMessage) {
  log.info({ locationValidationResponse: { location } }, message);
  res.locals.errorMessage = errorMessage;
  setLocationLabel(res, location);
  renderer.findHelp(req, res);
}

function renderNoResultsPage(req, res) {
  res.locals.nearbyServices = [];
  res.locals.openServices = [];
  renderer.results(req, res);
}
module.exports = {
  renderFindHelpPage,
  renderNoResultsPage
};
