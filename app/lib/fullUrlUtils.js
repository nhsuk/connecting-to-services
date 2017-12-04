function url(req) {
  const protocol = req.protocol;
  const host = req.get('host');
  const originalUrl = req.originalUrl;
  // eslint-disable-next-line no-script-url
  return `${protocol}${host}${originalUrl}`;
}

function fullUrlUtils(req) {
  return {
    url: url(req),
  };
}

module.exports = fullUrlUtils;
