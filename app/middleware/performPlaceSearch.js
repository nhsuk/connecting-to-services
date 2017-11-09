const log = require('../lib/logger');
const locate = require('../lib/locate');
const sortByLocalType = require('../lib/sortByLocalType');
const renderer = require('./renderer');
const createPlaceViewModel = require('./createPlaceViewModel');
const placeSearches = require('../lib/promCounters').placeSearches;
const placeDisambiguationViews = require('../lib/promCounters').placeDisambiguationViews;
const zeroPlaceResultsViews = require('../lib/promCounters').zeroPlaceResultsViews;

const maxResults = 10;

function englandFilter(place) {
  return place.country === 'England';
}

function logZeroResults(places, location) {
  if (places.length === 0) {
    log.warn({ location }, `No results were found for ${location}`);
    zeroPlaceResultsViews.inc(1);
  }
}

function incrementDisambiguationViews(places) {
  if (places.length > 0) {
    placeDisambiguationViews.inc(1);
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
    let places = await locate.byPlace(location, 100);
    placeSearches.inc(1);
    places = sortByLocalType(places.filter(englandFilter)).slice(0, maxResults);
    logZeroResults(places, location);
    if (places.length === 1) {
      res.locals.coordinates = getCoordinates(places[0]);
      next();
    } else {
      incrementDisambiguationViews(places);
      res.locals.places = createPlaceViewModel(places);
      renderer.places(req, res);
    }
  } catch (e) {
    log.error({ placeLookupResponse: { error: e } }, 'Place lookup error');
    next({ type: 'place-lookup-error', message: e.message });
  }
}

module.exports = getPlaces;
