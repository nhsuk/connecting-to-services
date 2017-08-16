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
    const fullNameAndAddress =
      `${item.name},${address}`;

    const encodedQuery = `saddr=${qs.escape(location)}&daddr=${qs.escape(fullNameAndAddress)}&near=${qs.escape(fullNameAndAddress)}`;
    const mapUrl = `https://maps.google.com/maps?${encodedQuery}`;

    // eslint-disable-next-line no-param-reassign
    item.mapUrl = mapUrl;
    return item;
  });
}

module.exports = {
  addUrl,
};
