const express = require('express');

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const nunjucks = require('nunjucks');
const router = require('./routes');
const locals = require('../app/middleware/locals');

module.exports = (app, config) => {
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

  app.use([
    /\/(symptoms|conditions)\/.*\/results/,
    /\/(symptoms|conditions)\/.*\/search/,
    /\/(symptoms|conditions)\/.*\/find-help/,
    /\/(symptoms|conditions)\/(\w|-)+/,
    '/',
  ],
      express.static(`${config.root}/public`));

  app.use('/', router);
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.statusCode = 404;
    next(err);
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.statusCode || 500);
    res.render('error', {
      message: err,
      error: app.get('env') === 'development' ? err : {},
      title: 'error',
    });
  });
};
