const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
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

  app.use(locals(config));

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(cookieParser());
  app.use(compress());

  app.get('/', (req, res) => {
    res.redirect(constants.SITE_ROOT);
  });

  app.use(constants.SITE_ROOT, express.static(`${config.root}/public`));

  app.use(constants.SITE_ROOT, router);
  app.use(constants.SITE_ROOT, (req, res) => {
    res.status(404);
    res.render('error-404', {});
  });

  // eslint-disable-next-line no-unused-vars
  app.use(constants.SITE_ROOT, (err, req, res, next) => {
    console.log(err);
    res.status(err.statusCode || 500);
    res.render('error', {
      message: err,
      error: app.get('env') === 'development' ? err : {},
      title: 'error',
    });
  });
};
