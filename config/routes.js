// eslint-disable-next-line new-cap
const router = require('express').Router();
const servicesMiddleware = require('../app/middleware/services');
const urlUtils = require('../app/middleware/urlUtils');
const validateLocation = require('../app/middleware/locationValidator');
const getPharmacies = require('../app/middleware/getPharmacies');
const coordinateResolver = require('../app/middleware/coordinateResolver');
const render = require('../app/middleware/renderer');

router.get('/',
  (req, res) => {
    res.render('index');
  }
);

router.get('/results-file',
  validateLocation,
  coordinateResolver,
  getPharmacies,
  render.results
);

router.get('/results',
  validateLocation,
  urlUtils.urlForPharmacyPostcodeSearch,
  servicesMiddleware.getPharmacies,
  servicesMiddleware.getPharmacyOpeningTimes,
  servicesMiddleware.prepareForRender,
  servicesMiddleware.renderServiceResults
);

router.get('/find-help',
  (req, res) => {
    res.render('find-help');
  }
);

router.get('/stomach-ache',
  (req, res) => {
    res.render('stomach-ache');
  }
);

module.exports = router;
