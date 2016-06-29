// eslint-disable-next-line new-cap
const router = require('express').Router();
const gpMiddleware = require('../app/middleware/gp-practice');

router.get('/gpdetails/:gpId',
  gpMiddleware.getUrl,
  gpMiddleware.getDetails,
  gpMiddleware.render
);

module.exports = router;
