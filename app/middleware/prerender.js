const addAddressLine = require('../lib/addAddressLine');
const addBankHolidayMessage = require('../lib/addBankHolidayMessage');
const choicesServices = require('../lib/choicesServices');
const mapLink = require('../lib/mapLink');
const updateOpeningTimes = require('../lib/updateOpeningTimes');

function updateServices(searchCriteria, services) {
  if (services && Array.isArray(services)) {
    /* eslint-disable no-param-reassign */
    services = mapLink.addUrl(searchCriteria, services);
    services = choicesServices.addUrl(services);
    services = addBankHolidayMessage(services);
    services = updateOpeningTimes(services);
    services = addAddressLine(services);
    /* eslint-enable no-param-reassign */
  }
  return services;
}

function results(req, res, next) {
  const searchCriteria = {
    coordinates: res.locals.coordinates,
    searchTerm: res.locals.location,
    searchType: res.locals.searchType,
  };

  res.locals.services = updateServices(searchCriteria, res.locals.services);

  next();
}

module.exports = {
  results,
};
