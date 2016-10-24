function fromRequest(req, res, next) {
  const context = req.query.context;
  // eslint-disable-next-line no-param-reassign
  res.locals.context = context;
  next();
}

module.exports = {
  fromRequest,
};
