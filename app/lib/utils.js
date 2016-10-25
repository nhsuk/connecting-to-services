function flip(boolString) {
  return (boolString === 'false') ? 'true' : 'false';
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

module.exports = {
  deepClone,
  flip,
};
