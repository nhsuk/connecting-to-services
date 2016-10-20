require('object.values').shim();

function joinAllTruthyValues(obj) {
  return Object.values(obj)
    .filter((value) => value)
    .join();
}

function addUrl(location, inputList) {
  const start = `saddr=${location}`;

  return inputList.map((item) => {
    const address = joinAllTruthyValues(item.address);
    const fullNameAndAddress =
      `${item.name},${address}`;
    const destination = `daddr=${fullNameAndAddress}`;
    const near = `near=${fullNameAndAddress}`;

    const mapUrl =
      `https://www.google.com/maps?${start}&${destination}&${near}`
      .replace(/ /g, '+');

    // eslint-disable-next-line no-param-reassign
    item.mapUrl = mapUrl;
    return item;
  });
}

module.exports = {
  addUrl,
};
