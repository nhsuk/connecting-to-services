const constants = require('./constants');

function dedupe(services) {
  const open = services.open[0];
  const nearby = services.nearby;
  let filteredNearby;

  if (!open) {
    filteredNearby = nearby.slice(0, constants.numberOfNearbyResultsToDisplay);
  } else {
    filteredNearby = nearby.filter(obj => open.identifier !== obj.identifier);
  }

  return {
    nearby: filteredNearby,
    open: services.open,
  };
}

module.exports = dedupe;
