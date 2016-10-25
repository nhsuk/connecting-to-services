function fromRequest(req, res, next) {
  // eslint-disable-next-line no-param-reassign
  res.locals.location = req.query.location;
  // eslint-disable-next-line no-param-reassign
  res.locals.context = req.query.context || '';
  next();
}

module.exports = {
  fromRequest,
};
