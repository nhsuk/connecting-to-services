const geolib = require('geolib');

const metersInAMile = 1600;

function sortByDistance(a, b) {
  return a.distanceInMiles - b.distanceInMiles;
}

function getDistanceInMiles(start, end) {
  const distanceInMeters = geolib.getDistance(start, end);
  return distanceInMeters / metersInAMile;
}

function nearby(searchPoint, geo, orgs) {
  // Use the geohash data to get the nearby orgs
  // Use the plain org data to grab the rest of the data

  const lengthOfUKInMiles = 850;
  const nearbyGeo =
    geo
    .limit(10)
    .nearBy(searchPoint.latitude, searchPoint.longitude, lengthOfUKInMiles * metersInAMile);

  const nearbyOrgs = nearbyGeo.map((item) => {
    let nearbyOrg = {};
    orgs.find((org) => {
      if (org.identifier === item.i) {
        nearbyOrg = org;
        return true;
      }
      return false;
    });
    nearbyOrg.distanceInMiles = getDistanceInMiles(searchPoint, nearbyOrg);

    return nearbyOrg;
  });

  return nearbyOrgs.sort(sortByDistance);
}

module.exports = {
  nearby,
};
