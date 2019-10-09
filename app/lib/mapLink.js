const qs = require('querystring');

const { postcodeSearch, yourLocationSearch } = require('./constants');

function flatten(arr) {
  return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []);
}

function joinAllTruthyValues(obj) {
  return flatten(Object.values(obj)).filter((value) => value).join();
}

function addUrl(searchCriteria, inputList) {
  return inputList.map((item) => {
    const address = joinAllTruthyValues(item.address);
    const fullNameAndAddress = `${item.name},${address}`;

    let saddr;

    if (searchCriteria.searchType === yourLocationSearch) {
      saddr = `${searchCriteria.coordinates.latitude},${searchCriteria.coordinates.longitude}`;
    } else if (searchCriteria.searchType === postcodeSearch) {
      ({ searchTerm: saddr } = searchCriteria);
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
