const log = require('./logger');

const localOrder = {
  City: 5,
  Town: 4,
  Village: 3,
  Hamlet: 2,
  'Other Settlement': 1,
  'Suburban Area': 0,
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
  if (first > second) {
    return -1;
  }
  if (first < second) {
    return 1;
  }
  return 0;
}

function sortPlace(places) {
  return places.sort((a, b) => {
    const first = getOrder(a.local_type);
    const second = getOrder(b.local_type);
    return compare(first, second) ||
           compare(b.name_1, a.name_1) ||
           compare(b.county_unitary || b.region, a.county_unitary || a.region) ||
           compare(b.outcode, a.outcode);
  });
}

module.exports = sortPlace;
