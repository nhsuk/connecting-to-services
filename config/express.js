const express = require('express');

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const nunjucks = require('nunjucks');
const router = require('./routes');

module.exports = (app, config) => {
  const env = process.env.NODE_ENV || 'development';
  /* eslint-disable no-param-reassign */
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';
  /* eslint-enable no-param-reassign */

  app.set('views', `${config.root}/app/views`);
  app.set('view engine', 'nunjucks');
  nunjucks.configure(`${config.root}/app/views`, {
    autoescape: true,
    express: app,
    watch: true,
  });

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(cookieParser());
  app.use(compress());

  app.use([
    /\/(symptoms|conditions)\/stomach-ache\/results/,
    /\/(symptoms|conditions)\/stomach-ache/,
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
