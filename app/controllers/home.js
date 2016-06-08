// eslint-disable-next-line new-cap
const router = require('express').Router();
const controllerUtils = require('../utils/controller-utils');

module.exports = (app) => {
  app.use('/', router);
};

const render = function render(r) {
  return (response) => {
    r.render('index', {
      title: 'GP Details',
      gpDetails: response,
    });
  };
};

router.get('/gpdetails/:gpId', (req, res) => {
  const url = controllerUtils.getSyndicationUrl(req);
  controllerUtils.getGpDetails(url, render(res));
});
