// eslint-disable-next-line new-cap
const router = require('express').Router();
const servicesMiddleware = require('../app/middleware/services');
const dateUtils = require('../app/lib/dateUtils');

function stomachAcheRender(req, res) {
  res.render('stomach-ache', {
  });
}

router.get('/',
  (req, res) => {
    res.render('index', { currentDateTime: dateUtils.nowForDisplay() });
  }
);

router.get('/search',
  (req, res) => { res.render('search', {}); }
);

router.post('/datetime',
  (req, res) => {
    dateUtils.setNow(req.body.datetime);
    res.redirect('/');
  }
);

router.get('/results',
  servicesMiddleware.getPharmacyUrl,
  servicesMiddleware.getWICUrl,
  servicesMiddleware.getPharmacies,
  servicesMiddleware.getWICs,
  servicesMiddleware.getPharmacyOpeningTimes,
  servicesMiddleware.getWICDetails,
  servicesMiddleware.prepareForRender,
  servicesMiddleware.renderServiceResults
);

router.get('/head-ache',
  (req, res) => { res.render('head-ache', {}); }
);

router.get('/rashes',
  (req, res) => { res.render('rashes', {}); }
);

router.get('/stomach-ache',
  stomachAcheRender
);

module.exports = router;
