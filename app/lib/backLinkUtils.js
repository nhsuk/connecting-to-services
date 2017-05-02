function url(req) {
  // eslint-disable-next-line no-script-url
  return req.get('referer') || 'javascript:history.back();';
}

function backLinkUtils(req) {
  return {
    text: 'Back',
    url: url(req),
  };
}

module.exports = backLinkUtils;
