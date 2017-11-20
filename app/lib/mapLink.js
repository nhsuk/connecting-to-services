require('object.values').shim();
const qs = require('querystring');

function joinAllTruthyValues(obj) {
  return Object.values(obj)
    .filter(value => value)
    .join();
}

function addUrl(location, inputList) {
  return inputList.map((item) => {
    const address = joinAllTruthyValues(item.address);
    const fullNameAndAddress = `${item.name},${address}`;

    const params = {
      saddr: location,
      daddr: fullNameAndAddress,
      near: fullNameAndAddress
    };
    // eslint-disable-next-line no-param-reassign
    item.mapUrl = `https://maps.google.com/maps?${qs.stringify(params)}`;
    return item;
  });
}

module.exports = {
  addUrl,
};
