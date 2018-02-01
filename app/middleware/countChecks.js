const counters = require('../lib/promCounters');

function incrementCounter(req, next, counter) {
  const check = req.query.check;
  if (check === '' || check) {
    counter.inc(1);
  }
  next();
}

function search(req, res, next) {
  incrementCounter(req, next, counters.searchCheck);
}

function results(req, res, next) {
  incrementCounter(req, next, counters.resultsCheck);
}

module.exports = {
  search,
  results,
};
