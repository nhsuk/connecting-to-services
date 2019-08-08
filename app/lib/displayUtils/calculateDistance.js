const radiusOfEarthInMiles = 3960;

function convertDegreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function calculateDistance(origin, destination) {
  const dLat = convertDegreesToRadians(destination.latitude - origin.latitude);
  const dLon = convertDegreesToRadians(destination.longitude - origin.longitude);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(convertDegreesToRadians(origin.latitude))
    * Math.cos(convertDegreesToRadians(destination.latitude))
    * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radiusOfEarthInMiles * c;
}

module.exports = calculateDistance;
