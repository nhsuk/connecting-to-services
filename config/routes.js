// eslint-disable-next-line new-cap
const router = require('express').Router();
const servicesMiddleware = require('../app/middleware/services');

function stomachAcheRender(req, res) {
  res.render('stomach-ache', {
  });
}

router.get('/search',
  (req, res) => { res.render('search', {}); }
);

router.get('/results',
  servicesMiddleware.getPharmacyUrl,
  servicesMiddleware.getPharmacies,
  servicesMiddleware.getPharmacyOpeningTimes,
  servicesMiddleware.renderPharmacyList
);

router.get('/stomach-ache',
  stomachAcheRender
);

module.exports = router;
