const router = require('express').Router();

const coordinateResolver = require('../app/middleware/coordinateResolver');
const countChecks = require('../app/middleware/countChecks');
const getPharmacies = require('../app/middleware/getPharmacies');
const locationValidator = require('../app/middleware/locationValidator');
const logZeroResults = require('../app/middleware/logZeroResults');
const prerender = require('../app/middleware/prerender');
const renderer = require('../app/middleware/renderer');
const setSearchType = require('../app/middleware/setSearchType');

router.get(
  '/',
  countChecks.search,
  renderer.findHelp
);

router.get(
  '/results',
  countChecks.results,
  setSearchType,
  locationValidator,
  coordinateResolver,
  getPharmacies,
  logZeroResults,
  prerender.results,
  renderer.results
);

module.exports = router;
