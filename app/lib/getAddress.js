function getAddress(place) {
  return `${place.name_1}, ${place.county_unitary || place.region}, ${place.outcode}`;
}

module.exports = getAddress;
