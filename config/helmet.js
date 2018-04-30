const helmet = require('helmet');
const contentSecurityPolicy = require('./contentSecurityPolicy');

function config(app) {
  app.use(helmet({
    contentSecurityPolicy,
    frameguard: { action: 'deny' },
    hsts: { includeSubDomains: false },
  }));
}

module.exports = config;
