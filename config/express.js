const log = require('../app/lib/logger');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const nunjucks = require('nunjucks');
const router = require('./routes');
const locals = require('../app/middleware/locals');
const constants = require('../app/lib/constants');

module.exports = (app, config) => {
  // eslint-disable-next-line no-param-reassign
  app.locals.SITE_ROOT = constants.SITE_ROOT;

  app.set('views', `${config.root}/app/views`);
  app.set('view engine', 'nunjucks');
  nunjucks.configure(`${config.root}/app/views`, {
    autoescape: true,
    express: app,
    watch: true,
  });

  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [
        '\'self\'',
      ],
      scriptSrc: [
        '\'self\'',
        'data:',
        'www.google-analytics.com',
        's.webtrends.com',
        'statse.webtrendslive.com',
        'static.hotjar.com',
        'script.hotjar.com',
        'cdn.jsdelivr.net',
      ],
      imgSrc: [
        '\'self\'',
        'data:',
        'www.google-analytics.com',
        'statse.webtrendslive.com',
        'hm.webtrends.com',
      ],
      styleSrc: [
        '\'self\'',
        'fast.fonts.net',
      ],
      fontSrc: [
        'fast.fonts.net',
      ],
      connectSrc: [
        '\'self\'',
        'https://*.hotjar.com',
        'wss://*.hotjar.com',
      ],
    },
  }));
  app.use(helmet.xssFilter());
  app.use(helmet({
    frameguard: {
      action: 'deny',
    },
  }));
  app.use(helmet.hidePoweredBy());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(locals(config));

  app.use((req, res, next) => {
    log.debug({ req });
    next();
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));

  app.use(cookieParser());
  app.use(compression());

  app.use(constants.SITE_ROOT, express.static(`${config.root}/public`));

  app.use(constants.SITE_ROOT, router);
  app.use(constants.SITE_ROOT, (req, res) => {
    log.warn({ req }, 404);
    res.status(404);
    res.render('error-404');
  });

  // eslint-disable-next-line no-unused-vars
  app.use(constants.SITE_ROOT, (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    log.error({ err }, statusCode);
    res.status(statusCode);
    res.render('error', {
      message: err,
      error: app.get('env') === 'development' ? err : {},
      title: 'error',
    });
  });

  app.get('/', (req, res) => {
    res.redirect(constants.SITE_ROOT);
  });
};
