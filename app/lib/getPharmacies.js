const geolib = require('geolib');

const metersInAMile = 1609;

function sortByDistance(a, b) {
  return a.distanceInMiles - b.distanceInMiles;
}

function getDistanceInMiles(start, end) {
  const distanceInMeters = geolib.getDistance(start, end);
  return distanceInMeters / metersInAMile;
}

function nearby(searchPoint, geo, limit) {
  const maxResults = limit || 10;
  const nearbyGeo =
    geo
    .nearBy(searchPoint.latitude, searchPoint.longitude, 50 * metersInAMile);

  const nearbyOrgs = nearbyGeo.map((item) => {
    // eslint-disable-next-line no-param-reassign
    item.distanceInMiles = getDistanceInMiles(searchPoint, item);

    return item;
  });

  return nearbyOrgs.sort(sortByDistance).slice(0, maxResults);
}

module.exports = {
  nearby,
};
