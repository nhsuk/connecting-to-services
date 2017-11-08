const log = require('./logger');

const localOrder = {
  City: 5,
  'Suburban Area': 4,
  Town: 3,
  Village: 2,
  Hamlet: 1,
  'Other Settlement': 0,
};

function getOrder(type) {
  const order = localOrder[type];
  if (order === undefined) {
    log.error(`unknown local_type '${type}'`);
    return -1;
  }
  return order;
}

function sortByLocalType(places) {
  return places.sort((a, b) => {
    const first = getOrder(a.local_type);
    const second = getOrder(b.local_type);
    if (first > second) {
      return -1;
    }
    if (first < second) {
      return 1;
    }
    return 0;
  });
}

module.exports = sortByLocalType;
