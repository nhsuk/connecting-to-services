function setLocationsOnLocals(res, location) {
  res.locals.location = location;
  res.locals.displayLocation = location && location.split(',')[0];
}

module.exports = setLocationsOnLocals;
