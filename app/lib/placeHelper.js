const log = require('./logger');

const localOrder = {
  City: 5,
  Hamlet: 2,
  'Other Settlement': 1,
  'Suburban Area': 0,
  Town: 4,
  Village: 3,
};

function getOrder(type) {
  const order = localOrder[type];
  if (order === undefined) {
    log.error(`unknown local_type '${type}'`);
    return -1;
  }
  return order;
}

function compare(first, second) {
  if (first < second) {
    return -1;
  }
  if (first > second) {
    return 1;
  }
  return 0;
}

function sortPlace(places) {
  return places.sort((a, b) => {
    const first = getOrder(a.local_type);
    const second = getOrder(b.local_type);
    return compare(second, first) ||
           compare(a.name_1, b.name_1) ||
           compare(a.county_unitary || a.region, b.county_unitary || b.region) ||
           compare(a.outcode, b.outcode);
  });
}

function getCountries(places) {
  return [...new Set(places.map(place => place.country))].sort(compare);
}

module.exports = {
  getCountries,
  sortPlace,
};
