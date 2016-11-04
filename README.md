# Connecting to services

[![Build Status](https://travis-ci.org/nhsuk/connecting-to-services.svg?branch=master)](https://travis-ci.org/nhsuk/connecting-to-services)
[![bitHound Dependencies](https://www.bithound.io/github/nhsuk/connecting-to-services/badges/dependencies.svg)](https://www.bithound.io/github/nhsuk/connecting-to-services/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/nhsuk/connecting-to-services/badges/devDependencies.svg)](https://www.bithound.io/github/nhsuk/connecting-to-services/master/dependencies/npm)
[![Coverage Status](https://coveralls.io/repos/github/nhsuk/connecting-to-services/badge.svg?branch=master)](https://coveralls.io/github/nhsuk/connecting-to-services?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/nhsuk/connecting-to-services/badge.svg)](https://snyk.io/test/github/nhsuk/connecting-to-services)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/cb52b7957b9748ff8f0d4fbfd12e7de6)](https://www.codacy.com/app/nhsuk/connecting-to-services?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nhsuk/connecting-to-services&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/cb52b7957b9748ff8f0d4fbfd12e7de6)](https://www.codacy.com/app/nhsuk/connecting-to-services?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nhsuk/connecting-to-services&amp;utm_campaign=Badge_Coverage)
[![NSP Status](https://nodesecurity.io/orgs/nhsuk/projects/f33c99ec-12f8-4a49-bae8-8d5c3b167cb8/badge)](https://nodesecurity.io/orgs/nhsuk/projects/f33c99ec-12f8-4a49-bae8-8d5c3b167cb8)

A service to help people connect to appropriate NHS services that
meet their time, location and accessibility needs.

## Hosting

There are a number of solutions employed to host the application. The version of
the application linked to from the live website is hosted in Azure, as is the
staging environment.

* [Live](http://beta.nhs.uk/finders/)
* [Staging](http://connecting-to-services-staging.azurewebsites.net/)

As the application is being developed, every branch of code has its own test
environment automatically built and deployed via Heroku's
[Review Apps](https://devcenter.heroku.com/articles/github-integration-review-apps)

The head of `master` is also automatically built and deployed into Heroku.
That is hosted [here](https://connecting-to-services.herokuapp.com/)

## Environment variables

Environment variables are expected to be managed by the environment in which
the application is being run. This is best practice as described by
[twelve-factor](https://12factor.net/config).

In order to protect the application from starting up without the required
env vars in place [require-environment-variables](https://www.npmjs.com/package/require-environment-variables)
is used to check for the env vars that are required for the application to run
successfully.
This happens during the application start-up. If an env var is not found the
application will fail to start and an appropriate message will be displayed.

Environment variables are used to set application level settings for each
environment.

| Variable                         | Description                                                               | Default                  | Required |
|:---------------------------------|:--------------------------------------------------------------------------|:-------------------------|----------|
| `NODE_ENV`                       | node environment                                                          | development              |          |
| `PORT`                           | server port                                                               | 3000                     |          |
| `GOOGLE_ANALYTICS_TRACKING_ID`   | [Google Analytics](https://www.google.co.uk/analytics) property id        |                          |          |
| `WEBTRENDS_ANALYTICS_TRACKING_ID`| [Webtrends](https://www.webtrends.com/) tracking id                       |                          |          |
| `HOTJAR_ANALYTICS_TRACKING_ID`   | [Hotjar](https://www.hotjar.com/) tracking id                             |                          |          |
| `PHARMACY_LIST_PATH`             | Path to json file containing list of pharmacies                           | `../data/pharmacy-list`  |          |

## FAQ

* Is the application failing to start?
> Ensure all expected environment variables are available within the environment
