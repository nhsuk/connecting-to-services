// eslint-disable-next-line new-cap
const router = require('express').Router();
const servicesMiddleware = require('../app/middleware/services');
const urlUtils = require('../app/middleware/urlUtils');
const validateLocation = require('../app/middleware/locationValidator');

router.get('/',
  (req, res) => {
    res.render('community-dentists-referrals');
  }
);

router.get('/community-dentists/search',
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

router.get('/community-dentists/results',
  validateLocation,
  servicesMiddleware.getCoordinatesForSearchLocation,
  servicesMiddleware.loadCommunityDentists,
  servicesMiddleware.getLocationForCommunityDentists,
  servicesMiddleware.prepareForRender,
  servicesMiddleware.renderServiceResults
);

router.get('/symptoms/stomach-ache/results',
  validateLocation,
  urlUtils.urlForPharmacyPostcodeSearch,
  servicesMiddleware.getPharmacies,
  servicesMiddleware.getPharmacyOpeningTimes,
  servicesMiddleware.prepareForRender,
  servicesMiddleware.renderServiceResults
);

router.get('/symptoms/stomach-ache/find-help',
  (req, res) => {
    res.render('find-help');
  }
);

router.get('/community-dentists/referrals',
  (req, res) => {
    res.render('community-dentists-referrals');
  }
);

module.exports = router;
