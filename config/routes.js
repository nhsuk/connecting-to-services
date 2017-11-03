const router = require('express').Router();
const locationValidator = require('../app/middleware/locationValidator');
const getPharmacies = require('../app/middleware/getPharmacies');
const getPlaces = require('../app/middleware/getPlaces');
const createPlaceViewModel = require('../app/middleware/createPlaceViewModel');
const coordinateResolver = require('../app/middleware/coordinateResolver');
const renderer = require('../app/middleware/renderer');
const prerender = require('../app/middleware/prerender');
const setLocals = require('../app/middleware/setLocals');
const logZeroResults = require('../app/middleware/logZeroResults');

router.get(
  '/',
  setLocals.fromRequest,
  renderer.findHelp
);

router.get(
  '/results',
  setLocals.fromRequest,
  locationValidator,
  coordinateResolver,
  getPharmacies,
  logZeroResults,
  prerender.results,
  renderer.results
);

router.get(
  '/places',
  setLocals.fromRequest,
  getPlaces,
  createPlaceViewModel,
  renderer.places
);

router.get(
  '/find-help',
  setLocals.fromRequest,
  renderer.findHelp
);

module.exports = router;
