function flip(boolString) {
  return (boolString === 'false') ? 'true' : 'false';
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) =>
    arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos);
}

module.exports = {
  deepClone,
  flip,
  removeDuplicates,
};
