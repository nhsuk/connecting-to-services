function fromRequest(req, res, next) {
  const location = req.query.location;
  const context = req.query.context || '';

  // eslint-disable-next-line no-param-reassign
  res.locals.context = context;
  // eslint-disable-next-line no-param-reassign
  res.locals.location = location;
  next();
}

module.exports = {
  fromRequest,
};
