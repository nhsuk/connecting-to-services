// eslint-disable-next-line new-cap
const router = require('express').Router();
const servicesMiddleware = require('../app/middleware/services');
const urlUtils = require('../app/middleware/urlUtils');
const validateLocation = require('../app/middleware/locationValidator');

router.get('/',
  (req, res) => {
    res.render('index');
  }
);

router.get('/search',
  (req, res) => {
    const query = req.query;

    let viewToRender = 'search';

    if ({}.hasOwnProperty.call(query, 'able')) {
      if (query.able === 'true') {
        viewToRender = 'search';
      } else {
        viewToRender = 'call-111';
      }
    }

    res.render(viewToRender, {});
  }
);

router.get('/results',
  validateLocation,
  urlUtils.urlForPharmacyPostcodeSearch,
  servicesMiddleware.getPharmacies,
  servicesMiddleware.getPharmacyOpeningTimes,
  servicesMiddleware.prepareForRender,
  servicesMiddleware.renderServiceResults
);

router.get('/:view',
  (req, res) => {
    const view = req.params.view.toLowerCase();
    res.render(view, {});
  }
);

module.exports = router;
