const formatOpeningTimes = require('./formatOpeningTimes');

function updateOpeningTimes(inputList) {
  return inputList.map((item) => {
    // eslint-disable-next-line no-param-reassign
    item.openingTimes = formatOpeningTimes(item.openingTimes);
    return item;
  });
}

module.exports = updateOpeningTimes;
