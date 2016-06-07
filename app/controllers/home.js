var express = require('express'),
  router = express.Router(),
  controllerUtils = require('../utils/controller-utils');

module.exports = function(app) {
  app.use('/', router);
};

router.get('/gpdetails/:gpId', function(req, res) {
  var url = controllerUtils.getSyndicationUrl(req);
  controllerUtils.getGpDetails(url, render(res));
});

var render = function(r) {
  return function(response) {
    r.render('index', {
      title: 'GP Details',
      gpDetails: response
    });
  };
};
