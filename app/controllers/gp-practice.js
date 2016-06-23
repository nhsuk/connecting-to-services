const controllerUtils = require('../utils/controller-utils');

const render = function render(r) {
  return (response) => {
    if (response.statusCode !== 200) {
      r.sendStatus(response.statusCode);
    } else {
      r.render('index', {
        title: 'GP Details',
        gpDetails: response,
      });
    }
  };
};

function index(req, res) {
  const url = controllerUtils.getSyndicationUrl(req);
  controllerUtils.getGpDetails(url, render(res));
}

module.exports = {
  index,
};
