const log = require('../lib/logger');
const locate = require('../lib/locate');
const renderer = require('../middleware/renderer');

// to do move to common library
function renderFindHelpPage(req, res, location, message, errorMessage) {
  log.info({ locationValidationResponse: { location } }, message);
  res.locals.errorMessage = errorMessage;
  renderer.findHelp(req, res);
}

function logZeroResults(places, location) {
  if (places.length === 0) {
    log.warn({ location }, `No results were found for ${location}`);
  }
}

async function getPlaces(req, res, next) {
  const location = req.query.location;
  try {
    const places = await locate.byPlace(location);
    res.locals.places = places.filter(place => place.country === 'England');
    logZeroResults(places, location);
    next();
  } catch (ex) {
    renderFindHelpPage(req, res, location, 'Find places error', ex.message);
  }
}

module.exports = getPlaces;