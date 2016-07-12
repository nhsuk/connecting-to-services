// eslint-disable-next-line new-cap
const router = require('express').Router();
const gpMiddleware = require('../app/middleware/gp');

router.get('/gpdetails/:gpId',
  gpMiddleware.upperCaseGpId,
  gpMiddleware.getUrl,
  gpMiddleware.getDetails,
  gpMiddleware.getOpeningTimes,
  gpMiddleware.render
);

module.exports = router;
