module.exports = (req) => `https://${req.hostname}${req.app.locals.siteRoot}/`;
