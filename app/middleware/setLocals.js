function getBackLinkText(res) {
  return res.locals.context === 'stomach-ache'
    ? 'Back to information on stomach ache'
    : 'Back';
}

function fromRequest(req, res, next) {
  /* eslint-disable no-param-reassign */
  res.locals.location = req.query.location;
  res.locals.context = req.query.context || '';
  // eslint-disable-next-line no-script-url
  res.locals.backLink = req.get('referer') || 'javascript:history.back();';
  res.locals.backLinkText = getBackLinkText(res);
  /* eslint-enable no-param-reassign */
  next();
}

module.exports = {
  fromRequest,
};
