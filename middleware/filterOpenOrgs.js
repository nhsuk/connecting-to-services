const OpeningTimes = require('moment-opening-times');
const moment = require('moment');

function filterOpenOrgs(req, res, next) {
  const results = req.results;
  const now = moment();

  const onlyOpenOrgs = results.filter((org) => {
    const openingTimes = new OpeningTimes(org.openingTimes, 'Europe/London');

    if (openingTimes.isOpen(now)) {
      return org;
    }
    return null;
  });
  const top3Results = onlyOpenOrgs.slice(0, 3);
  // eslint-disable-next-line no-param-reassign
  req.openResults = top3Results;
  next();
}

module.exports = filterOpenOrgs;
