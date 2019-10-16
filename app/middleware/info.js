const { getDateTime } = require('../lib/dateUtils');
const { version } = require('../../package');

module.exports = (req, res) => {
  res.json({
    now: getDateTime(),
    version,
  });
};
