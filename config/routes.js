// eslint-disable-next-line new-cap
const router = require('express').Router();
const gpMiddleware = require('../app/middleware/gp');

function stomachAcheRender(req, res) {
  res.render('stomach-ache', {
  });
}

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
