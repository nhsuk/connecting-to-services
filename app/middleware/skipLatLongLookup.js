function skipLatLongLookup(res) {
  return res.locals.location && res.locals.coordinates.longitude && res.locals.coordinates.latitude;
}

module.exports = skipLatLongLookup;
