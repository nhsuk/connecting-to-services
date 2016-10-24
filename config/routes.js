// eslint-disable-next-line new-cap
const router = require('express').Router();
const validateLocation = require('../app/middleware/locationValidator');
const getPharmacies = require('../app/middleware/getPharmacies');
const coordinateResolver = require('../app/middleware/coordinateResolver');
const render = require('../app/middleware/renderer');
const prerender = require('../app/middleware/prerender');

router.get('/',
  (req, res) => {
    res.redirect('find-help');
  }
);

router.get('/results',
  validateLocation,
  coordinateResolver,
  getPharmacies,
  prerender.results,
  render.results
);

router.get('/find-help',
  (req, res) => {
    const context = req.query.context;
    console.log(context);
    if (context === 'stomach-ache') {
      res.render('find-help-stomach-ache');
    } else {
      res.render('find-help');
    }
  }
);

router.get('/stomach-ache',
  (req, res) => {
    res.render('stomach-ache');
  }
);

module.exports = router;
