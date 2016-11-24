function fromRequest(req, res, next) {
  /* eslint-disable no-param-reassign */
  res.locals.location = req.query.location;
  res.locals.context = req.query.context || '';
  // eslint-disable-next-line no-script-url
  res.locals.backLink = req.get('referer') || 'javascript:history.back();';
  /* eslint-enable no-param-reassign */
  next();
}

module.exports = {
  fromRequest,
};
