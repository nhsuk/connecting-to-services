const qs = require('querystring');

const constants = require('./constants');

function joinAllTruthyValues(obj) {
  return Object.values(obj)
    .filter(value => value)
    .join();
}

function addUrl(searchCriteria, inputList) {
  return inputList.map((item) => {
    const address = joinAllTruthyValues(item.address);
    const fullNameAndAddress = `${item.name},${address}`;

    let saddr;

    if (searchCriteria.searchType === constants.yourLocationSearch) {
      saddr = `${searchCriteria.coordinates.latitude},${searchCriteria.coordinates.longitude}`;
    } else if (searchCriteria.searchType === constants.postcodeSearch) {
      saddr = searchCriteria.searchTerm;
    }

    const params = {
      daddr: fullNameAndAddress,
      near: fullNameAndAddress,
      saddr,
    };

    // eslint-disable-next-line no-param-reassign
    item.mapUrl = `https://maps.google.com/maps?${qs.stringify(params)}`;
    return item;
  });
}

module.exports = {
  addUrl,
};
