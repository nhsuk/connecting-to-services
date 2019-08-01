const radiusOfEarthInMiles = 3960;

function convertDegreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function calculateDistance(origin, destination) {
  const originLat = origin.lat;
  const originLon = origin.lon;
  const destLat = destination.lat;
  const destLon = destination.lon;

  const dLat = convertDegreesToRadians(destLat - originLat);
  const dLon = convertDegreesToRadians(destLon - originLon);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(convertDegreesToRadians(originLat)) * Math.cos(convertDegreesToRadians(destLat))
    * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radiusOfEarthInMiles * c;
}

module.exports = calculateDistance;
