const controllerUtils = require('../utils/controller-utils');

const render = function render(r, next) {
  return (response) => {
    if (response.statusCode !== 200) {
      const err = Error(`Could not get details for that GP: (${response.statusCode})`);
      err.status = response.statusCode;
      next(err);
    } else {
      r.render('index', {
        title: 'GP Details',
        gpDetails: response,
      });
    }
  };
};

function index(req, res, next) {
  const url = controllerUtils.getSyndicationUrl(req);
  controllerUtils.getGpDetails(url, render(res, next));
}

module.exports = {
  index,
};
