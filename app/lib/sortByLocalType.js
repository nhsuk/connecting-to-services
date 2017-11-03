const localOrder = {
  City: 5,
  'Suburban Area': 4,
  Town: 3,
  Village: 2,
  Hamlet: 1,
  'Other Settlement': 0,
};

function sortByLocalType(places) {
  return places.sort((a, b) => {
    const first = localOrder[a.local_type];
    const second = localOrder[b.local_type];
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
