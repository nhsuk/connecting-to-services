function text(res) {
  return res.locals.context === 'stomach-ache'
    ? 'Back to information on stomach ache'
    : 'Back';
}

function url(req, res) {
  let link;

  if (res.locals.context === 'stomach-ache') {
    link = '/symptoms/stomach-ache';
  } else {
    // eslint-disable-next-line no-script-url
    link = req.get('referer') || 'javascript:history.back();';
  }

  return link;
}

function backLinkUtils(req, res) {
  return {
    text: text(res),
    url: url(req, res),
  };
}

module.exports = backLinkUtils;
