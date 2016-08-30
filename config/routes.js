// eslint-disable-next-line new-cap
const router = require('express').Router();
const servicesMiddleware = require('../app/middleware/services');
const dateUtils = require('../app/lib/dateUtils');

router.get('/',
  (req, res) => {
    res.render('index', { currentDateTime: dateUtils.nowForDisplay() });
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

router.post('/datetime',
  (req, res) => {
    dateUtils.setNow(req.body.datetime);
    res.redirect('/');
  }
);

// Only get open things for display
router.get('/results-open',
  servicesMiddleware.getPharmacyUrl,
  servicesMiddleware.getPharmacies,
  servicesMiddleware.getPharmacyOpeningTimes,
  servicesMiddleware.prepareOpenThingsForRender,
  servicesMiddleware.getGoogleMapsInfo,
  servicesMiddleware.renderServiceResults
);

// No need to get distance and duration from Google
router.get('/results',
  servicesMiddleware.getPharmacyUrl,
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
