module.exports = (req) => `https://${req.hostname}${req.originalUrl}`;
