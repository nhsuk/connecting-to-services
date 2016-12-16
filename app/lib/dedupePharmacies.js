const constants = require('./constants');

function dedupe(services) {
  const open = services.open[0];
  let nearby = services.nearby;

  if (open) {
    nearby = nearby.filter(obj => open.identifier !== obj.identifier);
  }

  return {
    nearby: nearby.slice(0, constants.numberOfNearbyResultsToDisplay),
    open: services.open,
  };
}

module.exports = dedupe;
