const { getDateTime } = require('../lib/dateUtils');
const { version } = require('../../package');

module.exports = (req, res) => {
  res.json({
    serverDateTime: getDateTime(),
    version,
  });
};
