function text(res) {
  return res.locals.context === 'stomach-ache'
    ? 'Back to information on stomach ache'
    : 'Back';
}
function url(req) {
  // eslint-disable-next-line no-script-url
  return req.get('referer') || 'javascript:history.back();';
}

function backLinkUtils(req, res) {
  return {
    text: text(res),
    url: url(req),
  };
}

module.exports = backLinkUtils;
