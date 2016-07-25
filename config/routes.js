// eslint-disable-next-line new-cap
const router = require('express').Router();
const gpMiddleware = require('../app/middleware/gp');
const dateUtils = require('../app/lib/dateUtils.js');
var moment = require('moment-timezone');

function stomachAcheRender(req, res) {
  res.render('stomach-ache', {
  });
}

router.get('/search',
  (req, res) => { res.render('search', {}); }
);

router.get('/datetime',
  (req, res) => { 

    const m = moment();
    const ma = m.clone().tz('Europe/London');
    const inRange = dateUtils.timeInRange(ma, '09:00', '17:30');
    res.send( ma.format() + ' ' + inRange);
  }
);

router.get('/results',
  gpMiddleware.getPharmacyUrl,
  gpMiddleware.getPharmacies,
  gpMiddleware.getPharmacyOpeningTimes,
  gpMiddleware.renderPharmacyList
);

router.get('/gpdetails/:gpId',
  gpMiddleware.upperCaseGpId,
  gpMiddleware.getUrl,
  gpMiddleware.getDetails,
  gpMiddleware.getBookOnlineUrl,
  gpMiddleware.getOpeningTimes,
  gpMiddleware.render
);

router.get('/stomach-ache',
  stomachAcheRender
);

module.exports = router;
