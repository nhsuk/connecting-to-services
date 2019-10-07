const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const nunjucks = require('nunjucks');

const constants = require('../app/lib/constants');
const errorCounter = require('../app/lib/promCounters').errorPageViews;
const helmet = require('./helmet');
const locals = require('../app/middleware/locals');
const log = require('../app/lib/logger');
const promBundle = require('../app/lib/promBundle').middleware;
const router = require('./routes');

module.exports = (app, config) => {
  const siteRoot = constants.siteRoot;
  // eslint-disable-next-line no-param-reassign
  app.locals.siteRoot = siteRoot;
  // eslint-disable-next-line no-param-reassign
  app.locals.assetsUrl = constants.assetsUrl;
  // start collecting default metrics
  promBundle.promClient.collectDefaultMetrics();

  // Get nunjucks templates from app views and NHS frontend library
  const appViews = [
    `${config.root}/app/views`,
    'node_modules/nhsuk-frontend/packages/components',
  ];

  app.set('views', appViews);
  app.set('view engine', 'nunjucks');
  const nunjucksEnvironment = nunjucks.configure(appViews, {
    autoescape: true,
    express: app,
    watch: true,
  });
  log.info({ config: { nunjucksEnvironment } }, 'nunjucks environment configuration');

  helmet(app);

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

  app.use(siteRoot, express.static(`${config.root}/public`));
  app.use(siteRoot, express.static('node_modules/nhsuk-frontend/dist'));

  // metrics needs to be registered before routes wishing to have metrics generated
  // see https://github.com/jochen-schweizer/express-prom-bundle#sample-uusage
  app.use(promBundle);
  app.use(siteRoot, router);
  app.use(siteRoot, (req, res) => {
    log.warn({ req }, 404);
    res.status(404);
    res.render('error-404');
  });

  // eslint-disable-next-line no-unused-vars
  app.use(siteRoot, (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    errorCounter.inc(1);
    log.error({ error: { err, req, res } }, 'Error');
    res.status(statusCode);
    res.render('error', {
      error: app.get('env') === 'development' ? err : {},
      message: err,
      title: 'error',
    });
  });

  app.get('/', (req, res) => {
    res.redirect(siteRoot);
  });
};
