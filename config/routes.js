const router = require('express').Router();
const validateLocation = require('../app/middleware/locationValidator');
const getPharmacies = require('../app/middleware/getPharmacies');
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
  validateLocation,
  coordinateResolver,
  getPharmacies,
  logZeroResults,
  prerender.results,
  renderer.results
);

module.exports = router;
