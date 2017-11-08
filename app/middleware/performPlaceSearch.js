const log = require('../lib/logger');
const locate = require('../lib/locate');
const sortByLocalType = require('../lib/sortByLocalType');
const routeHelper = require('./routeHelper');
const renderer = require('./renderer');
const createPlaceViewModel = require('./createPlaceViewModel');
const placeSearches = require('../lib/promCounters').placeSearches;
const placeDisambiguationViews = require('../lib/promCounters').placeDisambiguationViews;
const zeroPlaceResultsViews = require('../lib/promCounters').zeroPlaceResultsViews;

function logZeroResults(places, location) {
  if (places.length === 0) {
    log.warn({ location }, `No results were found for ${location}`);
    zeroPlaceResultsViews.inc(1);
  }
}

function getCoordinates(place) {
  return {
    latitude: place.latitude,
    longitude: place.longitude
  };
}

async function getPlaces(req, res, next) {
  const location = req.query.location;
  try {
    let places = await locate.byPlace(location);
    placeSearches.inc(1);
    places = sortByLocalType(places.filter(place => place.country === 'England'));
    logZeroResults(places, location);
    if (places.length === 1) {
      res.locals.coordinates = getCoordinates(places[0]);
      next();
    } else {
      placeDisambiguationViews.inc(1);
      res.locals.places = createPlaceViewModel(places);
      renderer.places(req, res);
    }
  } catch (ex) {
    routeHelper.renderFindHelpPage(req, res, location, 'Find places error');
  }
}

module.exports = getPlaces;
