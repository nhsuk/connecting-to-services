function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function closesAtMidnight(moment) {
  const time = moment.format('HH:mm');
  return (time === '00:00' || time === '23:59');
}

module.exports = {
  closesAtMidnight,
  deepClone,
};
