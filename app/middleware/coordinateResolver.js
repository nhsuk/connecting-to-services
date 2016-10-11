function coordinateResolver(req, res, next) {
  // TODO: Actually do the coordindate resolution
  // eslint-disable-next-line no-param-reassign
  res.locals.coordinates = { longitude: -1.543775, latitude: 53.795432 };
  next();
}

module.exports = coordinateResolver;
