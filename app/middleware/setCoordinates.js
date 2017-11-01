function setCoordinates(req, res, next) {
  res.locals.coordinates = {
    latitude: req.query.latitude,
    longitude: req.query.longitude,
  };
  next();
}

module.exports = setCoordinates;
