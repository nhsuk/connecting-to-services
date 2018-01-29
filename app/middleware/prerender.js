const addBankHolidayMessage = require('../lib/addBankHolidayMessage');
const choicesOverview = require('../lib/choicesOverview');
const choicesServices = require('../lib/choicesServices');
const mapLink = require('../lib/mapLink');
const updateOpeningTimes = require('../lib/updateOpeningTimes');

function results(req, res, next) {
  const searchCriteria = {
    coordinates: res.locals.coordinates,
    searchTerm: res.locals.location,
    searchType: res.locals.searchType,
  };

  res.locals.services = mapLink.addUrl(searchCriteria, res.locals.services);
  res.locals.services = choicesOverview.addUrl(res.locals.services);
  res.locals.services = choicesServices.addUrl(res.locals.services);
  res.locals.services = addBankHolidayMessage(res.locals.services);
  res.locals.services = updateOpeningTimes(res.locals.services);

  next();
}

module.exports = {
  results,
};
