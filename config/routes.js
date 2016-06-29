// eslint-disable-next-line new-cap
const router = require('express').Router();
const gpPracticeController = require('../app/middleware/gp-practice');

router.get('/gpdetails/:gpId',
  gpPracticeController.getGpUrl,
  gpPracticeController.getGpDetails
);

module.exports = router;
