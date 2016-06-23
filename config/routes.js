// eslint-disable-next-line new-cap
const router = require('express').Router();
const gpPracticeController = require('../app/controllers/gp-practice');

router.get('/gpdetails/:gpId', gpPracticeController.index);

module.exports = router;
