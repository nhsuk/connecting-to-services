const express = require('express');
const glob = require('glob');

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const nunjucks = require('nunjucks');

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

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(`${config.root}/public`));
  app.use(methodOverride());

  const controllers = glob.sync(`${config.root}/app/controllers/*.js`);
  controllers.forEach((controller) => {
    // eslint-disable-next-line global-require
    require(controller)(app);
  });

  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (app.get('env') === 'development') {
    app.use((err, req, res) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error',
      });
    });
  }

  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      title: 'error',
    });
  });
};
