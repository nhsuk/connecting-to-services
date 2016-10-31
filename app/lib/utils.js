const bunyan = require('bunyan');

function flip(boolString) {
  return (boolString === 'false') ? 'true' : 'false';
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getLogLevel(environment) {
  return {
    production: bunyan.INFO,
    test: bunyan.FATAL,
  }[environment] || bunyan.DEBUG;
}

module.exports = {
  deepClone,
  flip,
  getLogLevel,
};
